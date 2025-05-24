import * as vscode from 'vscode';
import { IDService } from '../services/idService';

export class IDHoverProvider implements vscode.HoverProvider {
    private idService: IDService;

    constructor(idService: IDService) {
        this.idService = idService;
    }

    async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Hover | null> {
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return null;
        }

        const word = document.getText(range);
        const ids = await this.idService.getIDs();
        
        if (ids[word]) {
            const markdown = new vscode.MarkdownString();
            markdown.appendCodeblock(word, 'text');
            markdown.appendMarkdown(`**Dungeon Crawler World ID**\n\n${ids[word]}`);
            
            return new vscode.Hover(markdown, range);
        }

        return null;
    }
}
