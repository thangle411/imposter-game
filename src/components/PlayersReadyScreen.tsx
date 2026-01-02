import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface PlayersReadyScreenProps {
    handleShowResults: () => void
}

export function PlayersReadyScreen({handleShowResults}: PlayersReadyScreenProps) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background select-none">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Everyone is ready!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Button 
                        onClick={handleShowResults}
                        className="w-full h-12 text-base"
                        size="lg">
                            Click to check the real word
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}