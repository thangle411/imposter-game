import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Player } from '@/types/game'

interface WordRevealScreenProps {
  players: Player[]
  onAllReady: () => void
  onSkip: () => void
}

export function WordRevealScreen({ players, onAllReady, onSkip }: WordRevealScreenProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [readyPlayers, setReadyPlayers] = useState<Set<number>>(new Set())
  const [showGenericCard, setShowGenericCard] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  const currentPlayer = players[currentPlayerIndex]
  const allReady = readyPlayers.size === players.length

  const handleNext = () => {
    setShowGenericCard(prev => !prev)
    setReadyPlayers(prev => new Set(prev).add(currentPlayer.id))

    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(prev => prev + 1)
    }
  }

  useEffect(() => {
    if (allReady) {
      onAllReady()
    }
  }, [allReady, onAllReady])

  if (allReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-20 bg-background select-none">
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
      <div className="min-h-screen flex items-center justify-center p-4 pt-20 bg-background select-none">
        <Card className="w-full max-w-md">
          {!showGenericCard ?
            <CardContent>
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Click the button to reveal your word.
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
              <div className="space-y-6 py-4">
                {currentPlayer.word ? (
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-center">Your Word</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-green-500 text-4xl font-bold text-center py-4">
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

                <Button
                  onClick={() => setShowSkipDialog(true)}
                  variant="link"
                  className="w-full text-sm"
                  size="sm"
                >
                  Skip Word
                </Button>
              </div>
            </CardContent>}
        </Card>
      </div>

      <Dialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skip this word?</DialogTitle>
            <DialogDescription>
              Are you sure you want to skip this word and return to the setup screen? All current progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSkipDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowSkipDialog(false)
              onSkip()
            }}>
              Skip Word
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

