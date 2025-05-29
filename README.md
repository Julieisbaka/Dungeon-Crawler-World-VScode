# Dungeon Crawler World VSCode Extension

An extension for Visual Studio Code that provides JSON schema validation, markdown linting, and certificate management tools for the Dungeon Crawler World project.

## Features

### Core Features

- **JSON Schema Validation**: Automatic validation for project configuration files against the Dungeon Crawler World schemas
- **Markdown Linting**: Check markdown files for line length and formatting consistency
- **ID Snippets**: IntelliSense support for Dungeon Crawler World IDs with auto-completion and hover information
- **PFX Certificate Generation**: Generate new PFX certificates for secure communications

### Commands

- `Refresh Dungeon Crawler World IDs`: Update the local cache of available IDs
- `Lint Markdown Line Length`: Check all markdown files for lines exceeding 120 characters
- `Generate New PFX Certificate`: Create a new PFX certificate with custom parameters

### Keyboard Shortcuts

- `Ctrl+Shift+L` (Windows/Linux) or `Cmd+Shift+L` (Mac): Lint markdown line length (when editing markdown files)
- `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac): Generate PFX certificate (when working with certificate files)

## Configuration

### Extension Settings

- `dungeonCrawlerWorld.autoDeactivateOutsideRepo`: Automatically deactivate extension features when not in a Dungeon Crawler World repository (default: `false`)

## Requirements

### For PFX Certificate Generation

- OpenSSL must be installed and available in your system PATH
- On Windows: Download from [OpenSSL for Windows](https://slproweb.com/products/Win32OpenSSL.html)
- On macOS: Install via Homebrew: `brew install openssl`
- On Linux: Install via package manager: `sudo apt-get install openssl` (Ubuntu/Debian)

## Installation

1. Install the extension from the VS Code marketplace
2. Open a Dungeon Crawler World project
3. The extension will automatically activate and provide schema validation

## Usage

### JSON Schema Validation

The extension automatically validates the following files:

- `save-state.json` - Game save state files
- `config.json` - Configuration files
- Other JSON files in the project (excluding system files)

### Markdown Linting

Use the command palette (`Ctrl+Shift+P`) and search for "Lint Markdown Line Length" or use the keyboard shortcut `Ctrl+Shift+L` while editing a markdown file.

### ID Auto-completion

When working with JSON or TypeScript files, start typing an ID and the extension will provide auto-completion suggestions with descriptions.

### PFX Certificate Generation

1. Use the command palette and search for "Generate New PFX Certificate"
2. Enter a Common Name (e.g., `localhost` or your domain)
3. Set a password for the PFX file
4. The certificate will be generated in your workspace root

## Recommended Extensions

This extension works well with:

- EditorConfig for VS Code - Maintains consistent coding styles

## Support

For issues, feature requests, or contributions, please visit the [GitHub repository](https://github.com/Julieisbaka/Dungeon-Crawler-World-VScode).
