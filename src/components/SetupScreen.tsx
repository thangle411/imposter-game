import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { GAME_CONSTANTS } from '@/constants/game'
import type { SetupData, WordPair } from '@/types/game'
import { wordPairs } from '@/data/words'

interface SetupScreenProps {
  onStartGame: (setupData: SetupData) => void
}

export function SetupScreen({ onStartGame }: SetupScreenProps) {
  const [totalPlayers, setTotalPlayers] = useState<number>(4)
  const [spyPupCount, setSpyPupCount] = useState<number>(GAME_CONSTANTS.maxSpyPupCount[totalPlayers])
  const [confusedKittenCount, setConfusedKittenCount] = useState<number>(GAME_CONSTANTS.maxConfusedKittenCount[totalPlayers])
  const [goodKittenCount, setGoodKittenCount] = useState<number>(totalPlayers - spyPupCount - confusedKittenCount)
  const [wordPairMode, setWordPairMode] = useState<'select' | 'custom'>('select')
  const [selectedWordPairKey, setSelectedWordPairKey] = useState<string>(Object.keys(wordPairs)[0] || '')
  const [customMainWord, setCustomMainWord] = useState<string>('')
  const [customRelatedWord, setCustomRelatedWord] = useState<string>('')

  useEffect(() => {
    setGoodKittenCount(totalPlayers - spyPupCount - confusedKittenCount)
  }, [totalPlayers, spyPupCount, confusedKittenCount])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background overflow-y-scroll" style={{ scrollbarWidth: 'auto' }}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Imposter Game</CardTitle>
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
            <div className="space-y-2">
              <label htmlFor="wordPair" className="text-sm font-medium">
                Select Word Pair
              </label>
              <Select
                value={selectedWordPairKey}
                onValueChange={setSelectedWordPairKey}
              >
                <SelectTrigger id="wordPair" className="w-full h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                  {Object.entries(wordPairs).map(([key, pair]) => (
                    <SelectItem key={key} value={key}>
                      {pair.main} / {pair.related}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            onClick={() => {
              let wordPair: WordPair
              if (wordPairMode === 'select') {
                wordPair = wordPairs[selectedWordPairKey]
              } else {
                if (!customMainWord.trim() || !customRelatedWord.trim()) {
                  alert('Please enter both words')
                  return
                }
                wordPair = {
                  main: customMainWord.trim(),
                  related: customRelatedWord.trim()
                }
              }
              onStartGame({ totalPlayers, spyPupCount, confusedKittenCount, wordPair })
            }}
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

