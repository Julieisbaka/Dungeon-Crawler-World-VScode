/**
 * @file Markdown Line Length Linter
 * 
 * A utility script that checks Markdown files for lines exceeding a maximum length,
 * while ignoring comment lines. This helps maintain consistent and readable Markdown files.
 * 
 * The script recursively searches through directories to find all .md files and
 * reports any lines that exceed the configured maximum length (default: 120 characters).
 * 
 * @example
 * // Check all Markdown files in the current directory:
 * node Markdown-lint-length.js
 * 
 * // Check all Markdown files in a specific directory:
 * node Markdown-lint-length.js ./docs
 * 
 * @security
 * The script includes path validation to ensure that the target directory
 * is within the current working directory, preventing directory traversal attacks.
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const MAX_LENGTH = 120;

function isComment(line) {
  return /^\s*<!--[\s\S]*?-->\s*$/.test(line);
}

function checkFile(filePath) {
  const lines = readFileSync(filePath, "utf8").split("\n");
  lines.forEach((line, idx) => {
    if (!isComment(line) && line.length > MAX_LENGTH) {
      console.log(
        `${filePath}:${idx + 1}: Line exceeds ${MAX_LENGTH} characters`
      );
    }
  });
}

// Recursively find all .md files
function findMarkdownFiles(dir) {
  let results = [];
  readdirSync(dir).forEach((file) => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      results = results.concat(findMarkdownFiles(fullPath));
    } else if (file.endsWith(".md")) {
      results.push(fullPath);
    }
  });
  return results;
}

// Usage: node scripts/markdown-lint-ignore-comments.js [directory]
import { resolve } from "path";

const ROOT_DIR = process.cwd(); // Define a safe root directory
const targetDir = process.argv[2] ? resolve(process.argv[2]) : ROOT_DIR;

// Ensure the target directory is within the safe root directory
if (!targetDir.startsWith(ROOT_DIR)) {
  console.error(
    `Error: The specified directory is outside the allowed root directory: ${ROOT_DIR}`
  );
  process.exit(1);
}

findMarkdownFiles(targetDir).forEach(checkFile);