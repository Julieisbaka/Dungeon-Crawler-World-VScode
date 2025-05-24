# Change Log

All notable changes to the "Dungeon Crawler World" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.2] - Unreleased

### Added
- Configuration option `autoDeactivateOutsideRepo` to control extension activation
- Automatic extension deactivation when not in a Dungeon Crawler World repository
- Keyboard shortcuts for common commands:
  - `Ctrl+Shift+L` (Windows/Linux) or `Cmd+Shift+L` (Mac) for markdown line length linting

### Changed
- Improved console logging

## [0.0.1] - Initial Release

### Added
- JSON schema validation for Dungeon Crawler World project files
  - `save-state.json` validation using `Save.json` schema
  - `config.json` validation using `Shader.json` schema
  - General JSON validation using `schema.json`
  - Markdown line length linting command (`extension.lintMarkdownLength`)
  - Support for common JSON schema definitions
  - Integration with existing `Markdown-lint-length.js` script
  - VSCode command palette integration for markdown linting
