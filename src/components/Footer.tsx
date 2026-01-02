import { Button } from "./ui/button";

interface FooterProps {
  onOpenTimerSettings: () => void;
}

export function Footer({ onOpenTimerSettings }: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          onClick={onOpenTimerSettings}
          className="w-full text-sm text-muted-foreground hover:text-foreground"
        >
          ⏱️ Timer Settings
        </Button>
      </div>
    </footer>
  );
}

