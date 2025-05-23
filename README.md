# 🚀 commit-buddy

**AI-powered Conventional Commit Generator for Groq**

[![Demo video](https://github.com/youssef-of-web/commit-buddy/blob/main/assets/demo.mp4)](https://github.com/youssef-of-web/commit-buddy/blob/main/assets/demo.mp4)

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

1. **Groq API Key:**
   - Create a `.env` file in your project root:
     ```env
     GROQ_API_KEY=your-groq-api-key-here
     ```
   - Or set the environment variable directly in your shell.

---

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
