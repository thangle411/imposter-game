import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TimerSettingsScreenProps {
  currentTimerMinutes: number;
  onSave: (minutes: number) => void;
  onCancel: () => void;
}

// Function to play a beep sound using Web Audio API
function playBeepSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const duration = 2.5; // Duration in seconds (2-3 seconds)

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // Frequency in Hz
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

export function TimerSettingsScreen({
  currentTimerMinutes,
  onSave,
  onCancel,
}: TimerSettingsScreenProps) {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(
    currentTimerMinutes
  );
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const hasPlayedSoundRef = useRef(false);

  useEffect(() => {
    if (isCountingDown && timeRemaining > 0) {
      hasPlayedSoundRef.current = false;
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer reached 0
            if (!hasPlayedSoundRef.current) {
              playBeepSound();
              hasPlayedSoundRef.current = true;
            }
            // Keep isCountingDown true so the countdown view remains visible
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isCountingDown, timeRemaining]);

  const handleSave = () => {
    // Save the timer settings (App.tsx now keeps us on timer-settings screen)
    onSave(selectedMinutes);
    const totalSeconds = selectedMinutes * 60;
    setTimeRemaining(totalSeconds);
    setIsCountingDown(true);
  };

  const handleCancel = () => {
    setIsCountingDown(false);
    setTimeRemaining(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onCancel();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopTimer = () => {
    setIsCountingDown(false);
    setTimeRemaining(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background select-none">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Timer Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isCountingDown && (
            <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-muted/50 rounded-lg border">
              <div className="text-7xl font-bold text-primary">
                {formatTime(timeRemaining)}
              </div>
              <p className="text-muted-foreground text-sm">
                Discussion & Voting Phase
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Discussion & Voting Phase Duration
            </label>
            <Select
              value={selectedMinutes.toString()}
              onValueChange={(value) => setSelectedMinutes(parseInt(value))}
              disabled={isCountingDown}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 minute</SelectItem>
                <SelectItem value="2">2 minutes</SelectItem>
                <SelectItem value="3">3 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            {isCountingDown ? (
              <Button
                variant="outline"
                onClick={handleStopTimer}
                className="w-full h-12 text-base"
              >
                Stop Timer
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 h-12 text-base"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 h-12 text-base"
                  size="lg"
                >
                  Start Timer
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

