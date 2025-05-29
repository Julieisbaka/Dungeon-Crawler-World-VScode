# Change Log

All notable changes to the "Dungeon Crawler World" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Table of Contents

- [Change Log](#change-log)
  - [Table of Contents](#table-of-contents)
  - [0.0.5 - Unreleased](#005---unreleased)
    - [Added](#added)
    - [Changed](#changed)
  - [0.0.4](#004)
    - [Changed](#changed-1)
  - [0.0.3](#003)
    - [Added](#added-1)
    - [Changed](#changed-2)
    - [Removed](#removed)
  - [0.0.2](#002)
    - [Added](#added-2)
    - [Changed](#changed-3)
    - [Removed](#removed-1)
  - [0.0.1 - Initial Release](#001---initial-release)
    - [Added](#added-3)

## 0.0.5 - Unreleased

### Added

- Add command to generate a new pfx certificate
- Add keybind support for new command

### Changed

- Linted and formatted files
- Fixed minor security issues
- Reduced file size
- Fix bug in changelog
- Extend README

## [0.0.4](https://github.com/Julieisbaka/Dungeon-Crawler-World-VScode/releases/tag/0.0.4)

### Changed

- Updated `package.json` metadata
- Improved error handling and logging
- Refactored code for better maintainability
- Updated dependencies to latest versions
- Fix build errors

## [0.0.3](https://github.com/Julieisbaka/Dungeon-Crawler-World-VScode/releases/tag/0.0.3)

### Added

- Added configuration files

### Changed

- Update `package.json` metadata
- Sanitize errors

### Removed

- Removed unused files to reduce extension size

## [0.0.2](https://github.com/Julieisbaka/Dungeon-Crawler-World-VScode/releases/tag/0.0.2)

### Added

- Configuration option `autoDeactivateOutsideRepo` to control extension activation
- Automatic extension deactivation when not in a Dungeon Crawler World repository
- Keyboard shortcuts for common commands:
  - `Ctrl+Shift+L` (Windows/Linux) or `Cmd+Shift+L` (Mac) for markdown line length linting
- Add Backend for ID snippet support

### Changed

- Improved console logging
- Updated JSON schema validation to be more robust
  
### Removed

- Removed unused files to reduce extension size

## [0.0.1 - Initial Release](https://github.com/Julieisbaka/Dungeon-Crawler-World-VScode/releases/tag/0.0.1)

### Added

- JSON schema validation for Dungeon Crawler World project files
  - `save-state.json` validation using `Save.json` schema
  - `config.json` validation using `Shader.json` schema
  - General JSON validation using `schema.json`
  - Markdown line length linting command (`extension.lintMarkdownLength`)
  - Support for common JSON schema definitions
  - Integration with existing `Markdown-lint-length.js` script
  - VSCode command palette integration for markdown linting
