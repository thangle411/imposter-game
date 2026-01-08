const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface SeenWordsResponse {
    success: boolean;
    words: number[];
}

export async function fetchSeenWords({ jwt }: { jwt: string }): Promise<number[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/1/seen-words`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch seen words: ${response.statusText}`);
        }

        const data: SeenWordsResponse = await response.json();

        if (data.success) {
            return data.words;
        } else {
            throw new Error('Server returned unsuccessful response');
        }
    } catch (error) {
        console.error('Error fetching seen words from server:', error);
        // Return empty array on error to fall back to localStorage
        return [];
    }
}

export async function markWordAsSeenOnServer({ wordId, jwt }: { wordId: number, jwt: string }): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/1/seen-words`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ word_ids: [wordId] }),
        });

        if (!response.ok) {
            throw new Error(`Failed to mark word as seen: ${response.statusText}`);
        }

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error marking word as seen on server:', error);
        return false;
    }
}
