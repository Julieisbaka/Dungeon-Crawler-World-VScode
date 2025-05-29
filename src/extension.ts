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
            }        });
    });

    // Register PFX certificate generation command
    const generatePfxCommand = vscode.commands.registerCommand('dungeonCrawlerWorld.generatePfxCertificate', async () => {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                vscode.window.showErrorMessage('No workspace folder open.');
                return;
            }

            // Prompt for certificate details
            const commonName = await vscode.window.showInputBox({
                prompt: 'Enter Common Name (CN) for the certificate',
                placeholder: 'e.g., example.com or localhost'
            });

            if (!commonName) {
                return;
            }

            const password = await vscode.window.showInputBox({
                prompt: 'Enter password for the PFX file',
                password: true,
                placeholder: 'Password to protect the PFX file'
            });

            if (!password) {
                return;
            }

            const certName = commonName.replace(/[^a-zA-Z0-9]/g, '_');
            
            // Show progress
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Generating PFX Certificate...',
                cancellable: false
            }, async (progress: { report: (arg0: { increment: number; message: string; }) => void; }) => {
                progress.report({ increment: 20, message: 'Creating private key...' });

                const cwd = workspaceFolders[0].uri.fsPath;
                const keyPath = path.join(cwd, `${certName}.key`);
                const certPath = path.join(cwd, `${certName}.crt`);
                const pfxPath = path.join(cwd, `${certName}.pfx`);

                return new Promise<void>((resolve, reject) => {
                    // Generate private key
                    exec(`openssl genrsa -out "${keyPath}" 2048`, (err) => {
                        if (err) {
                            reject(new Error(`Failed to generate private key: ${err.message}`));
                            return;
                        }

                        progress.report({ increment: 40, message: 'Creating certificate...' });

                        // Generate certificate
                        const certCommand = `openssl req -new -x509 -key "${keyPath}" -out "${certPath}" -days 365 -subj "/CN=${commonName}"`;
                        exec(certCommand, (err) => {
                            if (err) {
                                reject(new Error(`Failed to generate certificate: ${err.message}`));
                                return;
                            }

                            progress.report({ increment: 70, message: 'Creating PFX file...' });

                            // Create PFX file
                            const pfxCommand = `openssl pkcs12 -export -out "${pfxPath}" -inkey "${keyPath}" -in "${certPath}" -password pass:${password}`;
                            exec(pfxCommand, (err) => {
                                if (err) {
                                    reject(new Error(`Failed to create PFX file: ${err.message}`));
                                    return;
                                }

                                progress.report({ increment: 100, message: 'Cleaning up...' });

                                // Clean up temporary files
                                try {
                                    fs.unlinkSync(keyPath);
                                    fs.unlinkSync(certPath);
                                } catch (cleanupErr) {
                                    console.warn('Failed to clean up temporary files:', cleanupErr);
                                }

                                resolve();
                            });
                        });
                    });
                });
            });

            vscode.window.showInformationMessage(`PFX certificate generated successfully: ${certName}.pfx`);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            vscode.window.showErrorMessage(`Failed to generate PFX certificate: ${errorMessage}`);
        }
    });

    context.subscriptions.push(completionDisposable, hoverDisposable, refreshCommand, lintCommand, generatePfxCommand);
}

export function deactivate() {}