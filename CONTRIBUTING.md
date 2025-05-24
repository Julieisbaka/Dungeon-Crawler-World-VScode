# Contributing to Dungeon Crawler World VSCode Extension

Thank you for your interest in contributing to the Dungeon Crawler World VSCode extension! This document provides guidelines and information for contributors.

## Table of Contents

- [Contributing to Dungeon Crawler World VSCode Extension](#contributing-to-dungeon-crawler-world-vscode-extension)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Development Setup](#development-setup)
  - [How to Contribute](#how-to-contribute)
    - [Reporting Issues](#reporting-issues)
    - [Submitting Changes](#submitting-changes)
  - [Coding Standards](#coding-standards)
    - [JavaScript](#javascript)
    - [JSON](#json)
    - [Commit Messages](#commit-messages)
  - [Project Structure](#project-structure)
  - [Questions?](#questions)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

### Development Setup

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/your-username/Dungeon-Crawler-World-VScode.git
   cd Dungeon-Crawler-World-VScode
   ```

2. Open the project in VSCode:

   ```bash
   code .
   ```

3. Press `F5` to run the extension in a new Extension Development Host window

## How to Contribute

### Reporting Issues

- Use the [GitHub Issues](https://github.com/Julieisbaka/Dungeon-Crawler-World-VScode/issues) page
- Provide a clear description of the issue
- Include steps to reproduce the problem
- Mention your VSCode version and operating system

### Submitting Changes

1. Create a new branch for your feature or fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the coding standards below

3. Test your changes thoroughly

4. Commit your changes with a descriptive message:

   ```bash
   git commit -m "Add feature: description of your changes"
   ```

5. Push to your fork and submit a pull request

## Coding Standards

### JavaScript

- Use $4$ spaces for indentation
- Use semicolons
- Use meaningful variable and function names
- Add comments for complex logic

### JSON

- Use $4$ spaces for indentation
- Validate JSON schemas before submitting

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to $72$ characters or less

## Project Structure

```yaml
Dungeon-Crawler-World-VScode/
├── extension.js          # Main extension logic
├── package.json          # Extension manifest
├── README.md            # Project documentation
├── CHANGELOG.md         # Version history
└── CONTRIBUTING.md      # This file
```

## Questions?

If you have questions about contributing, feel free to:

- Open an issue for discussion
- Contact the maintainers

Thank you for contributing to the Dungeon Crawler World project!
