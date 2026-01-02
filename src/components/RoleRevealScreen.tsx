import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Player } from '@/types/game'

interface RoleRevealScreenProps {
  players: Player[]
  onAllReady: () => void
}

const roleLabels: Record<string, string> = {
  'good-kitten': 'Good Kitten',
  'confused-kitten': 'Confused Kitten',
  'spy-pup': 'Spy Pup'
}

const roleColors: Record<string, string> = {
  'good-kitten': 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50',
  'confused-kitten': 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50',
  'spy-pup': 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50'
}

export function RoleRevealScreen({ players, onAllReady }: RoleRevealScreenProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [readyPlayers, setReadyPlayers] = useState<Set<number>>(new Set())
  const [showGenericCard, setShowGenericCard] = useState(false);

  const currentPlayer = players[currentPlayerIndex]
  const allReady = readyPlayers.size === players.length

  const handleNext = () => {
    setShowGenericCard(prev => !prev)
    setReadyPlayers(prev => new Set(prev).add(currentPlayer.id))
    
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(prev => prev + 1)
      // setIsOpen(true)
    } else {
      // setIsOpen(false)
    }
  }

  useEffect(() => {
    if (allReady) {
      onAllReady()
    }
  }, [allReady, onAllReady])

  if (allReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Everyone is ready!</CardTitle>
            <CardDescription>Starting discussion phase...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          {!showGenericCard ? 
          <CardContent>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Click the button to reveal your role.
              </CardTitle>
              <CardDescription className="text-lg text-center mb-4">
                Good luck!
              </CardDescription>
              <Button className='text-lg' onClick={() => setShowGenericCard(true)}>
                I&apos;m Ready
              </Button>
            </CardHeader>
          </CardContent> : 
          <CardContent className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Your Role
              </CardTitle>
              <CardDescription className="text-center">
                Keep this secret!
              </CardDescription>
            </CardHeader>
            <div className="space-y-6 py-4">
              <div className="flex justify-center">
                <Badge
                  variant="outline"
                  className={`text-lg px-4 py-2 ${roleColors[currentPlayer.role]}`}
                >
                  {roleLabels[currentPlayer.role]}
                </Badge>
              </div>

              {currentPlayer.word ? (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-center">Your Word</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-center py-4">
                      {currentPlayer.word}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-destructive/10 border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-center text-destructive">
                      No Word
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-muted-foreground py-4">
                      You are the spy pup. You don&apos;t know the word!
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleNext}
                className="w-full h-12 text-base"
                size="lg"
              >
                I&apos;m Ready
              </Button>
            </div>
          </CardContent>}
        </Card>
      </div>
    </>
  )
}

