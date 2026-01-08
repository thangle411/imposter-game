import { useState } from 'react'
import { SetupScreen } from '@/components/SetupScreen'
import { WordRevealScreen } from '@/components/WordRevealScreen'
import { ResultsScreen } from '@/components/ResultsScreen'
import { PlayersReadyScreen } from '@/components/PlayersReadyScreen'
import { TimerSettingsScreen } from '@/components/TimerSettingsScreen'
import { Header } from '@/components/Header'
import type { Player, GameState, SetupData } from '@/types/game'
import { assignRoles, assignWords } from '@/lib/gameLogic'
import { AuthProvider } from '@/lib/AuthContext'

function AppContent() {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    phase: 'setup',
    realWord: '',
    currentPlayerIndex: 0,
    timerMinutes: 2, // Default to 2 minutes
  })
  const [previousPhase, setPreviousPhase] = useState<GameState['phase']>('setup')

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
      realWord: '',
      timerMinutes: gameState.timerMinutes || 2
    })
  }

  const handleOpenTimerSettings = () => {
    setPreviousPhase(gameState.phase)
    setGameState(prev => ({
      ...prev,
      phase: 'timer-settings'
    }))
  }

  const handleSaveTimerSettings = (minutes: number) => {
    setGameState(prev => ({
      ...prev,
      timerMinutes: minutes,
      // Don't navigate away - stay on timer-settings screen
      phase: prev.phase === 'timer-settings' ? 'timer-settings' : previousPhase
    }))
  }

  const handleCancelTimerSettings = () => {
    setGameState(prev => ({
      ...prev,
      phase: previousPhase
    }))
  }

  // Render appropriate screen based on phase
  switch (gameState.phase) {
    case 'setup':
      return (
        <>
          <Header />
          <SetupScreen onStartGame={handleStartGame} />
        </>
      )

    case 'word-reveal':
      return (
        <>
          <Header />
          <WordRevealScreen
            players={gameState.players}
            onAllReady={handleAllReady}
          />
        </>
      )

    case 'players-ready':
      return (
        <>
          <Header />
          <PlayersReadyScreen
            handleShowResults={handleShowResults}
            onOpenTimerSettings={handleOpenTimerSettings}
          />
        </>
      )

    case 'result-check':
      return (
        <>
          <Header />
          <ResultsScreen
            realWord={gameState.realWord}
            onPlayAgain={handlePlayAgain}
            onOpenTimerSettings={handleOpenTimerSettings}
          />
        </>
      )

    case 'timer-settings':
      return (
        <>
          <Header />
          <TimerSettingsScreen
            currentTimerMinutes={gameState.timerMinutes || 2}
            onSave={handleSaveTimerSettings}
            onCancel={handleCancelTimerSettings}
          />
        </>
      )

    default:
      return (
        <>
          <Header />
          <SetupScreen onStartGame={handleStartGame} />
        </>
      )
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
