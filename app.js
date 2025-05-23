#!/usr/bin/env node
import 'dotenv/config';
import simpleGit from 'simple-git';
import { ChatGroq } from '@langchain/groq';
import ora from 'ora';

const git = simpleGit();

// Check if GROQ API key exists
if (!process.env.GROQ_API_KEY) {
  console.error('Error: GROQ_API_KEY is not set in your environment variables');
  process.exit(1);
}

const model = new ChatGroq({
  model: 'meta-llama/llama-4-scout-17b-16e-instruct',
  temperature: 0.7,
  apiKey: process.env.GROQ_API_KEY,
});

async function getGitDiff() {
  return await git.diff(['--cached']);
}

async function generateCommit(diff) {
  if (!diff.trim()) {
    throw new Error(
      'No staged changes found. Please stage your changes before running.'
    );
  }

  try {
    const response = await model.invoke([
      {
        role: 'system',
        content: `You are an expert AI assistant specialized in generating clear, concise, and conventional git commit messages.\nFollow the conventional commits specification (feat, fix, docs, chore, refactor, etc.).\nSummarize the important changes from the provided git diff.\nUse bullet points if multiple points are relevant.\nThe commit message should be understandable by developers looking at the project history.`,
      },
      {
        role: 'user',
        content: `Git diff:\n${diff}`,
      },
    ]);
    return response.content;
  } catch (error) {
    if (
      error.message.includes('unauthorized') ||
      error.message.includes('invalid api key')
    ) {
      throw new Error(
        'Invalid or expired GROQ API key. Please check your credentials.'
      );
    }
    throw error;
  }
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

async function getGitDiffWithSpinner() {
  const spinner = createSpinner('Getting staged git diff...');
  try {
    const diff = await getGitDiff();
    spinner.succeed('Git diff loaded!');
    return diff;
  } catch (err) {
    spinner.fail('Failed to get git diff: ' + err.message);
    throw err;
  }
}

async function generateCommitWithSpinner(diff) {
  const spinner = createSpinner('Generating commit message with AI...');
  try {
    const commitMessage = await generateCommit(diff);
    spinner.succeed('Commit message generated!');
    return commitMessage;
  } catch (err) {
    spinner.fail('Failed to generate commit message: ' + err.message);
    throw err;
  }
}

async function main() {
  try {
    const diff = await getGitDiffWithSpinner();
    const commitMessage = await generateCommitWithSpinner(diff);
    console.log('\nGenerated commit message:\n');
    console.log(commitMessage);
    process.exit(0); // Exit successfully
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit with error
  }
}

main();
