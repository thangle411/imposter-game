import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GAME_CONSTANTS } from '@/constants/game'
import type { SetupData } from '@/types/game'

interface SetupScreenProps {
  onStartGame: (setupData: SetupData) => void
}

export function SetupScreen({ onStartGame }: SetupScreenProps) {
  const [totalPlayers, setTotalPlayers] = useState<number>(4)
  const [spyPupCount, setSpyPupCount] = useState<number>(GAME_CONSTANTS.maxSpyPupCount[totalPlayers])
  const [confusedKittenCount, setConfusedKittenCount] = useState<number>(GAME_CONSTANTS.maxConfusedKittenCount[totalPlayers])
  const [goodKittenCount, setGoodKittenCount] = useState<number>(totalPlayers - spyPupCount - confusedKittenCount)

  useEffect(() => {
    setGoodKittenCount(totalPlayers - spyPupCount - confusedKittenCount)
  }, [totalPlayers, spyPupCount, confusedKittenCount])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
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
              <SelectContent>
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
              <SelectContent>
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
              <SelectContent>
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
            <div className="text-sm text-gray-500">
              {goodKittenCount} Good Kittens
            </div>
          </div>
          <Button
            onClick={() => onStartGame({ totalPlayers, spyPupCount, confusedKittenCount })}
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

