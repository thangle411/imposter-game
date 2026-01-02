import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface ResultsScreenProps {
  realWord: string
  onPlayAgain: () => void
}

export function ResultsScreen({
  realWord,
  onPlayAgain
}: ResultsScreenProps) {
  const [isHolding, setIsHolding] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Global event handlers to ensure release is captured even if pointer leaves the element
  useEffect(() => {
    if (!isHolding) return

    const handleGlobalMouseUp = () => setIsHolding(false)
    const handleGlobalTouchEnd = () => setIsHolding(false)
    const handleGlobalPointerUp = () => setIsHolding(false)

    // Use capture phase to ensure we catch the event
    document.addEventListener('mouseup', handleGlobalMouseUp, { capture: true, passive: true })
    document.addEventListener('touchend', handleGlobalTouchEnd, { capture: true, passive: true })
    document.addEventListener('touchcancel', handleGlobalTouchEnd, { capture: true, passive: true })
    document.addEventListener('pointerup', handleGlobalPointerUp, { capture: true, passive: true })

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp, { capture: true })
      document.removeEventListener('touchend', handleGlobalTouchEnd, { capture: true })
      document.removeEventListener('touchcancel', handleGlobalTouchEnd, { capture: true })
      document.removeEventListener('pointerup', handleGlobalPointerUp, { capture: true })
    }
  }, [isHolding])

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault() // Prevent text selection
    setIsHolding(true)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault() // Prevent scrolling and text selection
    setIsHolding(true)
  }

  const handlePlayAgainClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmPlayAgain = () => {
    setShowConfirmDialog(false)
    onPlayAgain()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background select-none">
      <Card className="w-full max-w-md">
        <div className="space-y-6 py-4">
           <CardHeader className="spacy-y-1 p-2 mb-3">
            <CardTitle className="text-2xl text-center">
              Hold down to reveal word
            </CardTitle>
          </CardHeader>
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={`text-5xl px-4 py-2 bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/5 cursor-pointer select-none touch-none ${
                !isHolding ? 'blur-sm' : ''
              }`}
              onPointerDown={handlePointerDown}
              onTouchStart={handleTouchStart}
              style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            >
              {isHolding ? realWord : 'Hold to reveal'}
            </Badge>
          </div>
        </div>
        
        <CardContent className="space-y-6 mt-4">
          <Button
            onClick={handlePlayAgainClick}
            className="w-full h-14 text-base"
            size="lg"
          >
            Play Again
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Play Again?</DialogTitle>
            <DialogDescription>
              Are you sure you want to start a new game?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmPlayAgain}>
              Play Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

