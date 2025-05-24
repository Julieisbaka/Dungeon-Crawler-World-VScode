const vscode = require('vscode');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

function isDungeonCrawlerWorldRepo(workspacePath) {
    // Check for .git folder and verify it's the Dungeon Crawler World repository
    const gitPath = path.join(workspacePath, '.git');
    if (!fs.existsSync(gitPath)) {
        return false;
    }
    
    try {
        // Check if it's a git worktree (contains gitdir file)
        const gitConfigPath = fs.lstatSync(gitPath).isDirectory() 
            ? path.join(gitPath, 'config')
            : null;
            
        if (!gitConfigPath || !fs.existsSync(gitConfigPath)) {
            return false;
        }
        
        // Read git config to check remote URL
        const gitConfig = fs.readFileSync(gitConfigPath, 'utf8');
        const dungeonCrawlerRepoUrls = [
            'github.com/Julieisbaka/Dungeon-crawler-world',
            'github.com/Julieisbaka/Dungeon-Crawler-World-VScode'
        ];
        
        return dungeonCrawlerRepoUrls.some(url => gitConfig.includes(url));
    } catch (error) {
        return false;
    }
}

function shouldActivateFeatures() {
    const config = vscode.workspace.getConfiguration('dungeonCrawlerWorld');
    const autoDeactivate = config.get('autoDeactivateOutsideRepo', true);
    
    if (!autoDeactivate) {
        return true;
    }
    
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return false;
    }
    
    return isDungeonCrawlerWorldRepo(workspaceFolders[0].uri.fsPath);
}

function activate(context) {
    if (!shouldActivateFeatures()) {
        console.log('Dungeon Crawler World extension deactivated - not in repository and is auto-deactivation enabled');
        return;
    }

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