# Imposter Game

A social deduction game where players must figure out who knows the secret word and who doesn't. Built with React, TypeScript, and Vite.

## Demo

https://imposter-game-tl.netlify.app/

## Game Overview

In this game, players are assigned different roles with different knowledge:
- **Good Kittens**: Know the real word and must help identify the imposters
- **Confused Kittens**: Know a related (but different) word, making them appear suspicious
- **Spy Pups**: Don't know any word and must blend in without revealing their ignorance

The goal is for the Good Kittens to identify the Spy Pups, while the Spy Pups try to avoid detection.

## How to Play

### Setup Phase
1. Select the number of players (4-12)
2. Choose how many Spy Pups you want (varies by player count)
3. Choose how many Confused Kittens you want (varies by player count)
4. Select a word pair:
   - Choose from existing word pairs
   - Or enter custom words
   - Option to randomly select from unplayed word pairs

### Role Reveal Phase
- Each player takes turns viewing their role and word (if they have one)
- Players must keep their role and word secret
- Spy Pups will see "No Word" instead of a word

### Clue Phase
- Each player gives one word clue related to their given word
- Players must not repeat another player's clue
- Players must not say the given word itself
- Spy Pups must give a clue without knowing the word, making this phase crucial for detection

### Discussion Phase
- Good Kittens try to identify who doesn't know the word
- Spy Pups try to blend in and guess the word
- Confused Kittens may seem suspicious because they know a different word

### Elimination Phase
- After each discussion phase, all players vote to eliminate one player
- **If a Spy Pup is eliminated:**
  - The eliminated Spy Pup can attempt to guess the word
  - If they guess correctly, the Spy Pups and Confused Kittens win the game
  - If they guess incorrectly, the game continues with the remaining players
- **If a Good Kitten or Confused Kitten is eliminated:**
  - The eliminated player must reveal themselves by checking against the real word in the app
  - The game continues with the remaining players
- The game continues with alternating Discussion and Elimination phases until only 2 players remain. Start with the person to the left of the eliminated player.
- **End Game Condition:**
  - If both remaining players are Good Kittens, the Good Kittens win
  - If both remaining players are not Good Kittens (i.e., at least one is a Spy Pup or Confused Kitten), the Spy Pups and Confused Kittens win

## Game Configuration

### Player Count Limits
- **4 players**: 0 Spy Pups, up to 1 Confused Kitten
- **5-8 players**: Up to 1 Spy Pup, up to 2 Confused Kittens
- **9-12 players**: Up to 2 Spy Pups, up to 3 Confused Kittens

The remaining players are always Good Kittens.

### Word Pairs
- The game includes a collection of word pairs
- Each word pair consists of a main word (for Good Kittens) and a related word (for Confused Kittens)
- Word pairs are tracked in localStorage to avoid repetition
- Custom word pairs can be entered for more variety

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - UI component library

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── SetupScreen.tsx         # Game setup and configuration
│   ├── RoleRevealScreen.tsx    # Individual role reveal
│   ├── PlayersReadyScreen.tsx  # Waiting screen before discussion
│   ├── ResultsScreen.tsx       # Final word reveal
│   └── ui/                     # Reusable UI components
├── constants/
│   └── game.ts          # Game configuration constants
├── data/
│   └── words.ts         # Word pair database
├── lib/
│   ├── gameLogic.ts     # Core game logic (role/word assignment)
│   └── utils.ts         # Utility functions
└── types/
    └── game.ts          # TypeScript type definitions
```

## Game Logic

### Role Assignment
Roles are randomly shuffled and assigned to players based on the configuration:
1. Spy Pups are assigned first
2. Confused Kittens are assigned next
3. Remaining players become Good Kittens
4. All roles are shuffled randomly

### Word Assignment
- **Good Kittens**: Receive the main word from the word pair
- **Confused Kittens**: Receive the related word from the word pair
- **Spy Pups**: Receive no word

## Features

- ✅ Configurable player counts (4-12)
- ✅ Flexible role distribution
- ✅ Word pair selection or custom words
- ✅ Random word pair selection
- ✅ Played word pair tracking (localStorage)
- ✅ Responsive design
- ✅ Dark mode support