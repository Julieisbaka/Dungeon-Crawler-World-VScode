import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { IDCompletionProvider } from './providers/idCompletionProvider';
import { IDHoverProvider } from './providers/idHoverProvider';
import { IDService } from './services/idService';

function isDungeonCrawlerWorldRepo(workspacePath: string): boolean {
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

function shouldActivateFeatures(): boolean {
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

export function activate(context: vscode.ExtensionContext) {
    if (!shouldActivateFeatures()) {
        console.log('Dungeon Crawler World extension deactivated - not in repository and auto-deactivation is enabled');
        return;
    }

    // Initialize ID service
    const idService = new IDService();
    
    // Register ID completion provider
    const idCompletionProvider = new IDCompletionProvider(idService);
    const completionDisposable = vscode.languages.registerCompletionItemProvider(
        [
            { scheme: 'file', language: 'json' },
            { scheme: 'file', language: 'jsonc' },
            { scheme: 'file', language: 'javascript' },
            { scheme: 'file', language: 'typescript' }
        ],
        idCompletionProvider
    );
    
    // Register ID hover provider
    const idHoverProvider = new IDHoverProvider(idService);
    const hoverDisposable = vscode.languages.registerHoverProvider(
        [
            { scheme: 'file', language: 'json' },
            { scheme: 'file', language: 'jsonc' },
            { scheme: 'file', language: 'javascript' },
            { scheme: 'file', language: 'typescript' }
        ],
        idHoverProvider
    );
    
    // Register refresh command
    const refreshCommand = vscode.commands.registerCommand('dungeonCrawlerWorld.refreshIDs', () => {
        idService.refreshCache();
        vscode.window.showInformationMessage('Dungeon Crawler World IDs refreshed!');
    });

    // Register markdown linting command
    const lintCommand = vscode.commands.registerCommand('extension.lintMarkdownLength', () => {
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

    context.subscriptions.push(completionDisposable, hoverDisposable, refreshCommand, lintCommand);
}

export function deactivate() {}