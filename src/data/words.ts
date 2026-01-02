import type { WordPair } from '@/types/game'

export const wordPairs: Record<string, WordPair> = {
  1: {
    main: 'Hand',
    related: 'Wrist'
  },
  2: {
    main: 'Basketball',
    related: 'Volleyball'
  }
}

export function getRandomPair(): { name: string; pair: WordPair } {
  const entries = Object.entries(wordPairs)
  const randomEntry = entries[Math.floor(Math.random() * entries.length)]
  return {
    name: randomEntry[0],
    pair: randomEntry[1]
  }
}

