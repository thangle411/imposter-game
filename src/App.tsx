import { useState } from 'react'
import { SetupScreen } from '@/components/SetupScreen'
import { WordRevealScreen } from '@/components/WordRevealScreen'
import { ResultsScreen } from '@/components/ResultsScreen'
import { PlayersReadyScreen } from '@/components/PlayersReadyScreen'
import type { Player, GameState, SetupData } from '@/types/game'
import { assignRoles, assignWords } from '@/lib/gameLogic'

function App() {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    phase: 'setup',
    realWord: '',
    currentPlayerIndex: 0,
  })

  const handleStartGame = ({ totalPlayers, spyPupCount, confusedKittenCount, wordPair }: SetupData) => {
    const players: Player[] = Array.from({ length: totalPlayers }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`,
      role: 'good-kitten' // will be reassigned
    }))

    const roles = assignRoles({ totalPlayers, spyPupCount, confusedKittenCount })
    const playersWithRoles = players.map((player, index) => ({
      ...player,
      role: roles[index]
    }))

    const { players: playersWithWords, realWord } = assignWords(playersWithRoles, wordPair)

    setGameState({
      players: playersWithWords,
      phase: 'word-reveal',
      currentPlayerIndex: 0,
      realWord
    })
  }

  const handleAllReady = () => {
    setGameState(prev => ({
      ...prev,
      phase: 'players-ready',
      currentPlayerIndex: 0
    }))
  }

  const handleShowResults = () => {
    setGameState(prev => ({
      ...prev,
      phase: 'result-check',
    }))
  }

  const handlePlayAgain = () => {
    setGameState({
      players: [],
      phase: 'setup',
      currentPlayerIndex: 0,
      realWord: ''
    })
  }

  // Render appropriate screen based on phase
  switch (gameState.phase) {
    case 'setup':
      return <SetupScreen onStartGame={handleStartGame} />

    case 'word-reveal':
      return (
        <WordRevealScreen
          players={gameState.players}
          onAllReady={handleAllReady}
        />
      )

    case 'players-ready':
      return (
        <PlayersReadyScreen handleShowResults={handleShowResults}></PlayersReadyScreen>
      )

    case 'result-check':
      return (
        <ResultsScreen
          realWord={gameState.realWord}
          onPlayAgain={handlePlayAgain}
        />
      )

    default:
      return <SetupScreen onStartGame={handleStartGame} />
  }
}

export default App
