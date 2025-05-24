import * as vscode from 'vscode';
import { IDCompletionProvider } from './providers/idCompletionProvider';
import { IDHoverProvider } from './providers/idHoverProvider';
import { IDService } from './services/idService';

export function activate(context: vscode.ExtensionContext) {
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

    context.subscriptions.push(completionDisposable, hoverDisposable, refreshCommand);
}