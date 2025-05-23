#!/usr/bin/env node
import 'dotenv/config';
import simpleGit from 'simple-git';
import { ChatGroq } from '@langchain/groq';
import OpenAI from 'openai';
import ora from 'ora';

const git = simpleGit();

class GroqModel {
  constructor(apiKey) {
    this.model = new ChatGroq({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 0.7,
      apiKey,
    });
  }

  async generateCommitMessage(diff) {
    const response = await this.model.invoke([
      {
        role: 'system',
        content: `You are an expert AI assistant specialized in generating clear, concise, and conventional git commit messages.
Follow the conventional commits specification (feat, fix, docs, chore, refactor, etc.).
Summarize the important changes from the provided git diff.
Use bullet points if multiple points are relevant.
The commit message should be understandable by developers looking at the project history.`,
      },
      {
        role: 'user',
        content: `Git diff:\n${diff}`,
      },
    ]);
    return response.content;
  }
}

class QwenModel {
  constructor(apiKey) {
    this.openAI = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
    });
  }

  async generateCommitMessage(diff) {
    const response = await this.openAI.chat.completions.create({
      model: 'qwen/qwen3-235b-a22b',
      messages: [
        {
          role: 'system',
          content: `You are an expert AI assistant specialized in generating clear, concise, and conventional git commit messages.
Follow the conventional commits specification (feat, fix, docs, chore, refactor, etc.).
Summarize the important changes from the provided git diff.
Use bullet points if multiple points are relevant.
The commit message should be understandable by developers looking at the project history.`,
        },
        {
          role: 'user',
          content: `Git diff:\n${diff}`,
        },
      ],
    });

    return response.choices[0].message.content;
  }
}

function createModel(provider) {
  switch (provider) {
    case 'groq':
      if (!process.env.GROQ_API_KEY) {
        throw new Error(
          'GROQ_API_KEY is not set in your environment variables'
        );
      }
      return new GroqModel(process.env.GROQ_API_KEY);
    case 'qwen':
      if (!process.env.QWEN_API_KEY) {
        throw new Error(
          'QWEN_API_KEY is not set in your environment variables'
        );
      }
      return new QwenModel(process.env.QWEN_API_KEY);
    default:
      throw new Error(`Unsupported MODEL_PROVIDER: ${provider}`);
  }
}

async function getStagedDiff() {
  return git.diff(['--cached']);
}

function createSpinner(text) {
  return ora({
    text,
    spinner: {
      interval: 120,
      frames: ['⡿', '⣿', '⣷', '⣯', '⣟', '⡿', '⣿', '⣾', '⣽', '⣻', '⢿', '⡿'],
    },
  }).start();
}

async function main() {
  const provider = (process.env.MODEL_PROVIDER || 'groq').toLowerCase();

  let model;
  try {
    model = createModel(provider);
  } catch (err) {
    console.error(`Error initializing model: ${err.message}`);
    process.exit(1);
  }

  let diff;
  const spinnerDiff = createSpinner('Retrieving staged git diff...');
  try {
    diff = await getStagedDiff();
    spinnerDiff.succeed('Staged git diff retrieved!');
  } catch (err) {
    spinnerDiff.fail(`Failed to retrieve git diff: ${err.message}`);
    process.exit(1);
  }

  if (!diff.trim()) {
    console.error(
      'No staged changes found. Please stage your changes before running.'
    );
    process.exit(1);
  }

  const spinnerCommit = createSpinner('Generating commit message using AI...');
  try {
    const commitMessage = await model.generateCommitMessage(diff);
    spinnerCommit.succeed('Commit message generated successfully!\n');
    console.log(commitMessage);
    process.exit(0);
  } catch (err) {
    spinnerCommit.fail(`Failed to generate commit message: ${err.message}`);

    if (
      err.message.toLowerCase().includes('unauthorized') ||
      err.message.toLowerCase().includes('invalid api key')
    ) {
      console.error(
        'Invalid or expired API key detected. Please check your credentials.'
      );
    }

    process.exit(1);
  }
}

main();
