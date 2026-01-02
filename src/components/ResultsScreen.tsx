import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

interface ResultsScreenProps {
  realWord: string
  onPlayAgain: () => void
}

export function ResultsScreen({
  realWord,
  onPlayAgain
}: ResultsScreenProps) {

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <div className="space-y-6 py-4">
          <CardHeader className="spacy-y-1 p-2 mb-3">
            <CardTitle className="text-2xl text-center">
              Real word is
            </CardTitle>
          </CardHeader>
          <div className="flex justify-center">
          <Badge
            variant="outline"
            className={`text-5xl px-4 py-2 bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/5`}
          >
            {realWord}
          </Badge>
          </div>
        </div>
        
        <CardContent className="space-y-6">
          <Button
            onClick={onPlayAgain}
            className="w-full h-14 text-base"
            size="lg"
          >
            Play Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

