const vscode = require('vscode');
const { exec } = require('child_process');
const path = require('path');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.lintMarkdownLength', function () {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open.');
            return;
        }
        const cwd = workspaceFolders[0].uri.fsPath;
        const scriptPath = path.join(cwd, 'Markdown-lint-length.js');
        exec(`node "${scriptPath}" "${cwd}"`, (err, stdout, stderr) => {
            if (err) {
                vscode.window.showErrorMessage(`Lint failed: ${stderr || err.message}`);
                return;
            }
            if (stdout) {
                vscode.window.showInformationMessage(stdout, { modal: true });
            } else {
                vscode.window.showInformationMessage('No Markdown line length issues found.');
            }
        });
    });

    context.subscriptions.push(disposable);
}

exports.activate = activate;