import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { GAME_CONSTANTS } from '@/constants/game'
import type { SetupData, WordPair } from '@/types/game'
import { wordPairs } from '@/data/words'
import { useAuth } from '@/lib/AuthContext'
import { fetchSeenWords, markWordAsSeenOnServer } from '@/lib/api'

const PLAYED_WORD_PAIRS_KEY = 'imposter-game-played-word-pairs'

interface SetupScreenProps {
  onStartGame: (setupData: SetupData) => void
}

export function SetupScreen({ onStartGame }: SetupScreenProps) {
  const { user, jwt } = useAuth();
  const [totalPlayers, setTotalPlayers] = useState<number>(4)
  const [spyPupCount, setSpyPupCount] = useState<number>(GAME_CONSTANTS.maxSpyPupCount[totalPlayers])
  const [confusedKittenCount, setConfusedKittenCount] = useState<number>(GAME_CONSTANTS.maxConfusedKittenCount[totalPlayers])
  const [goodKittenCount, setGoodKittenCount] = useState<number>(totalPlayers - spyPupCount - confusedKittenCount)
  const [wordPairMode, setWordPairMode] = useState<'select' | 'custom'>('select')
  const [useRandomPair, setUseRandomPair] = useState<boolean>(false)
  const [customMainWord, setCustomMainWord] = useState<string>('')
  const [customRelatedWord, setCustomRelatedWord] = useState<string>('')
  const [languageFilter, setLanguageFilter] = useState<'all' | 'english' | 'vietnamese'>('all')
  const [serverSeenWords, setServerSeenWords] = useState<number[]>([])

  // Fetch seen words from server when user is logged in
  useEffect(() => {
    if (user && jwt) {
      const loadSeenWords = async () => {
        try {
          const seenWords = await fetchSeenWords({ jwt })
          setServerSeenWords(seenWords)
        } catch (error) {
          console.error('Failed to load seen words from server:', error)
        }
      }
      loadSeenWords()
    }
  }, [user, jwt])

  // Get played word pairs based on auth status
  const getPlayedWordPairKeys = (): Set<string> => {
    if (user && jwt && serverSeenWords.length > 0) {
      // Use server data if logged in
      return new Set(serverSeenWords.map(id => id.toString()))
    } else {
      // Fall back to localStorage
      try {
        const stored = localStorage.getItem(PLAYED_WORD_PAIRS_KEY)
        if (stored) {
          const keys = JSON.parse(stored) as string[]
          return new Set(keys)
        }
      } catch (error) {
        console.error('Error reading played word pairs from localStorage:', error)
      }
      return new Set<string>()
    }
  }

  const markWordPairAsPlayed = async (wordPairKey: string): Promise<void> => {
    try {
      if (user && jwt) {
        // Save to server if logged in
        const wordId = parseInt(wordPairKey)
        await markWordAsSeenOnServer({ wordId, jwt })
        // Update local state to reflect the change
        setServerSeenWords(prev => [...prev, wordId])
      } else {
        // Save to localStorage if not logged in
        try {
          const stored = localStorage.getItem(PLAYED_WORD_PAIRS_KEY)
          const playedKeys = stored ? new Set(JSON.parse(stored) as string[]) : new Set<string>()
          playedKeys.add(wordPairKey)
          localStorage.setItem(PLAYED_WORD_PAIRS_KEY, JSON.stringify(Array.from(playedKeys)))
        } catch (error) {
          console.error('Error saving played word pair to localStorage:', error)
        }
      }
    } catch (error) {
      console.error('Error saving played word pair to localStorage:', error)
    }
  }

  // Get available word pairs (excluding played ones and filtered by language)
  const playedKeys = getPlayedWordPairKeys()
  const availableWordPairs = Object.entries(wordPairs).filter(([key, pair]) => {
    if (playedKeys.has(key)) return false
    if (languageFilter === 'all') return true
    return pair.language === languageFilter
  })
  const availableWordPairKeys = availableWordPairs.map(([key]) => key)

  const [selectedWordPairKey, setSelectedWordPairKey] = useState<string>(availableWordPairKeys[0] || '')

  useEffect(() => {
    setGoodKittenCount(totalPlayers - spyPupCount - confusedKittenCount)
  }, [totalPlayers, spyPupCount, confusedKittenCount])

  // Update selected key when available pairs change
  useEffect(() => {
    if (availableWordPairKeys.length > 0 && !availableWordPairKeys.includes(selectedWordPairKey)) {
      setSelectedWordPairKey(availableWordPairKeys[0])
    } else if (availableWordPairKeys.length === 0) {
      setSelectedWordPairKey('')
    }
  }, [availableWordPairKeys.join(','), languageFilter, serverSeenWords.length])

  const handleStartGame = async () => {
    let wordPair: WordPair
    let wordPairKey: string | null = null

    if (wordPairMode === 'select') {
      if (useRandomPair) {
        // Get random pair from available (unplayed) pairs, excluding key "0" (placeholder)
        const validPairs = availableWordPairs.filter(([key]) => key !== '0')
        if (validPairs.length === 0) {
          alert('All word pairs have been played! Please use custom words or clear localStorage.')
          return
        }
        const randomIndex = Math.floor(Math.random() * validPairs.length)
        const [key, pair] = validPairs[randomIndex]
        wordPair = pair
        wordPairKey = key
      } else {
        if (!selectedWordPairKey || !wordPairs[selectedWordPairKey]) {
          alert('Please select a word pair or use custom words.')
          return
        }
        wordPair = wordPairs[selectedWordPairKey]
        wordPairKey = selectedWordPairKey
      }
    } else {
      if (!customMainWord.trim() || !customRelatedWord.trim()) {
        alert('Please enter both words')
        return
      }
      wordPair = {
        main: customMainWord.trim(),
        related: customRelatedWord.trim(),
      }
      // Custom words don't have keys, so we don't track them
    }

    // Mark word pair as played if it has a key
    if (wordPairKey && wordPairKey !== '0') {
      markWordPairAsPlayed(wordPairKey)
    }

    onStartGame({ totalPlayers, spyPupCount, confusedKittenCount, wordPair })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20 bg-background relative select-none">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex justify-center items-center"><img src='/logo.png' width={150} /></CardTitle>
          <CardDescription className="text-base mt-2">
            Good kittens, confused kittens, and (a) spy pup(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="players" className="text-sm font-medium">
              Number of Players
            </label>
            <Select
              value={totalPlayers.toString()}
              onValueChange={(value) => setTotalPlayers(parseInt(value))}
            >
              <SelectTrigger id="players" className="w-full h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                {GAME_CONSTANTS.playerCounts.map((count) => (
                  <SelectItem key={count} value={count.toString()}>
                    {count} Players
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {GAME_CONSTANTS.maxSpyPupCount[totalPlayers] > 0 && <div className="space-y-2">
            <label htmlFor="spyPupCount" className="text-sm font-medium">
              Number of Spy Pups
            </label>
            <Select
              value={spyPupCount.toString()}
              onValueChange={(value) => setSpyPupCount(parseInt(value))}
            >
              <SelectTrigger id="spyPupCount" className="w-full h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                {Array.from({ length: GAME_CONSTANTS.maxSpyPupCount[totalPlayers] }, (_, i) => i + 1).map((count) => (
                  <SelectItem key={count} value={count.toString()}>
                    {count} Spy Pups
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>}
          {GAME_CONSTANTS.maxConfusedKittenCount[totalPlayers] > 0 && <div className="space-y-2">
            <label htmlFor="confusedKittenCount" className="text-sm font-medium">
              Number of Confused Kittens
            </label>
            <Select
              value={confusedKittenCount.toString()}
              onValueChange={(value) => setConfusedKittenCount(parseInt(value))}
            >
              <SelectTrigger id="confusedKittenCount" className="w-full h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                {Array.from({ length: GAME_CONSTANTS.maxConfusedKittenCount[totalPlayers] }, (_, i) => i + 1).map((count) => (
                  <SelectItem key={count} value={count.toString()}>
                    {count} Confused Kittens
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>}
          <div className="space-y-2">
            <label htmlFor="goodKittenCount" className="text-sm font-medium">
              Number of Good Kittens
            </label>
            <div className="text-2xl text-green-500">
              {goodKittenCount} Good Kittens
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="wordPairMode" className="text-sm font-medium">
              Word Pair
            </label>
            <Select
              value={wordPairMode}
              onValueChange={(value) => setWordPairMode(value as 'select' | 'custom')}
            >
              <SelectTrigger id="wordPairMode" className="w-full h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                <SelectItem value="select">Select from existing</SelectItem>
                <SelectItem value="custom">Enter custom words</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {wordPairMode === 'select' ? (
            <>
              <div className="space-y-2">
                <label htmlFor="languageFilter" className="text-sm font-medium">
                  Language Filter
                </label>
                <Select
                  value={languageFilter}
                  onValueChange={(value) => setLanguageFilter(value as 'all' | 'english' | 'vietnamese')}
                >
                  <SelectTrigger id="languageFilter" className="w-full h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="vietnamese">Vietnamese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="randomPair"
                  checked={useRandomPair}
                  onChange={(e) => setUseRandomPair(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="randomPair" className="text-sm font-medium cursor-pointer">
                  Randomly select a word pair
                </label>
              </div>
              <div className="space-y-2">
                <label htmlFor="wordPair" className="text-sm font-medium">
                  Select Word Pair
                </label>
                {availableWordPairs.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-3 border rounded-md">
                    {languageFilter === 'all'
                      ? 'All word pairs have been played. Please use custom words or clear localStorage to reset.'
                      : `No ${languageFilter} word pairs available. Please select a different language or use custom words.`}
                  </div>
                ) : (
                  <Select
                    value={selectedWordPairKey}
                    onValueChange={setSelectedWordPairKey}
                    disabled={useRandomPair}
                  >
                    <SelectTrigger id="wordPair" className="w-full h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                      {availableWordPairs.map(([key, pair]) => (
                        <SelectItem key={key} value={key}>
                          {pair.main} / {pair.related}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="mainWord" className="text-sm font-medium">
                  Main Word (for Good Kittens)
                </label>
                <Input
                  id="mainWord"
                  value={customMainWord}
                  onChange={(e) => setCustomMainWord(e.target.value)}
                  placeholder="Enter main word"
                  className="w-full h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="relatedWord" className="text-sm font-medium">
                  Related Word (for Confused Kittens)
                </label>
                <Input
                  id="relatedWord"
                  value={customRelatedWord}
                  onChange={(e) => setCustomRelatedWord(e.target.value)}
                  placeholder="Enter related word"
                  className="w-full h-12 text-base"
                />
              </div>
            </>
          )}
          <Button
            onClick={handleStartGame}
            className="w-full h-12 text-base"
            size="lg"
          >
            Start Game
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

