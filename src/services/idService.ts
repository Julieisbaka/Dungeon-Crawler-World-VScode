import * as vscode from 'vscode';
import * as https from 'https';

interface IDData {
    [key: string]: string;
}

export class IDService {
    private static readonly ID_FILE_URL = 'https://raw.githubusercontent.com/Julieisbaka/Dungeon-crawler-world/Main/ID.jsonc';
    private cachedIDs: IDData = {};
    private lastFetchTime: number = 0;
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    async getIDs(): Promise<IDData> {
        const now = Date.now();
        if (now - this.lastFetchTime < this.CACHE_DURATION && Object.keys(this.cachedIDs).length > 0) {
            return this.cachedIDs;
        }

        try {
            const content = await this.fetchIDFile();
            this.cachedIDs = this.parseIDContent(content);
            this.lastFetchTime = now;
            return this.cachedIDs;
        } catch (error) {
            const sanitizedError = error instanceof Error
                ? error.message.replace(/\n|\r/g, '')
                : String(error).replace(/\n|\r/g, '');
            console.error('Failed to fetch ID file:', sanitizedError);
            vscode.window.showWarningMessage('Failed to fetch Dungeon Crawler World IDs. Using cached data if available.');
            return this.cachedIDs;
        }
    }

    private fetchIDFile(): Promise<string> {
        return new Promise((resolve, reject) => {
            https.get(IDService.ID_FILE_URL, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    if (response.statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                    }
                });
            }).on('error', (error) => {
                reject(error);
            });
        });
    }

    private parseIDContent(content: string): IDData {
        try {
            // Remove JSONC comments and parse
            const cleanedContent = this.removeComments(content);
            const parsed = JSON.parse(cleanedContent);

            const ids: IDData = {};

            // Extract IDs and their descriptions from the original content with comments
            const lines = content.split('\n');

            for (const line of lines) {
                const trimmed = line.trim();
                // Match pattern: "id": value, // description
                const match = trimmed.match(/^"([^"]+)"\s*:\s*[^,]*,?\s*\/\/\s*(.+)$/);
                if (match) {
                    const [, id, description] = match;
                    ids[id] = description.trim();
                }
                // Also match pattern without quotes for simple IDs
                const simpleMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*[^,]*,?\s*\/\/\s*(.+)$/);
                if (simpleMatch && !match) {
                    const [, id, description] = simpleMatch;
                    ids[id] = description.trim();
                }
            }

            return ids;
        } catch (error) {
            console.error('Failed to parse ID file:', error);
            return {};
        }
    }

    private removeComments(content: string): string {
        // Simple JSONC comment removal
        return content
            .split('\n')
            .map(line => {
                const commentIndex = line.indexOf('//');
                if (commentIndex !== -1) {
                    return line.substring(0, commentIndex);
                }
                return line;
            })
            .join('\n');
    }

    refreshCache(): void {
        this.lastFetchTime = 0;
        this.cachedIDs = {};
    }
}
