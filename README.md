# 🚀 commit-buddy

**AI-powered Conventional Commit Generator for Groq**

[![Demo video](./assets/demo.gif)](./assets/demo.gif)

`commit-buddy` is a CLI tool that leverages Groq's blazing-fast LLMs to generate Conventional Commit messages from your staged git changes. Save time, stay consistent, and let AI handle your commit messages!

---

## ✨ Features

- **Groq-Only**: Built exclusively for Groq's LLM API for ultra-fast, accurate commit messages.
- **Seamless Git Integration**: Reads your staged changes and crafts a detailed, actionable commit message.
- **Easy to Use**: One command, instant results.

---

## 📦 Installation

Install globally with your favorite package manager:

```bash
npm install -g commit-buddy
```

or

```bash
yarn global add commit-buddy
```

or

```bash
pnpm add -g commit-buddy
```

---

## ⚡️ Usage

1. **Stage your changes:**
   ```bash
   git add .
   ```
2. **Run commit-buddy:**
   ```bash
   commit-buddy
   ```
3. **Review and use the generated commit message!**

---

## 🛠️ Configuration

Create a `.env` file in your project root to configure your API keys:

```env
GROQ_API_KEY=your-groq-api-key-here
OPEN_ROUTER_API_KEY=your-qwen-api-key-here
```

1. **Groq API Key:**
   Go to your [Groq Console](your [Groq Console](https://groq.com) and generate an API key.

   ```env
   GROQ_API_KEY=your-groq-api-key-here
   ```

   - Or set the environment variable directly in your shell.

2. **Qwen API Key:**
   Go to openrouter.ai and generate an API key.
   ```env
   OPEN_ROUTER_API_KEY=your-qwen-api-key-here
   ```

---

3. **Optional:**
   Model Provider
   By default, commit-buddy uses Groq's LLM API. You can also use Qwen by setting the environment variable.
   ```env
   MODEL_PROVIDER=qwen
   ```

## 📝 Example

```bash
$ git add .
$ commit-buddy
✔️ Generating commit message ...

```

---

## 📄 License

MIT

---

> Created with ❤️ for users. Contributions welcome!
