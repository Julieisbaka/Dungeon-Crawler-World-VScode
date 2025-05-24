import * as vscode from 'vscode';
import { IDService } from '../services/idService';

export class IDCompletionProvider implements vscode.CompletionItemProvider {
    private idService: IDService;

    constructor(idService: IDService) {
        this.idService = idService;
    }

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        const completionItems: vscode.CompletionItem[] = [];
        const ids = await this.idService.getIDs();

        for (const [id, description] of Object.entries(ids)) {
            const item = new vscode.CompletionItem(id, vscode.CompletionItemKind.Constant);
            item.detail = 'Dungeon Crawler World ID';
            item.documentation = new vscode.MarkdownString(description || 'No description available');
            item.insertText = id;
            completionItems.push(item);
        }

        return completionItems;
    }
}
