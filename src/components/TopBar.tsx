import { Bot, Wifi, WifiOff, Battery, Zap } from 'lucide-react';
import { useRobotStore } from '@/stores/robotStore';

const TopBar = () => {
  const { connected, energy, emotion, personality } = useRobotStore();

  return (
    <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Bot className="h-5 w-5 text-primary" />
        <h1 className="text-sm font-semibold tracking-tight">
          Robot AI <span className="text-primary">Local</span>
        </h1>
        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">v1.0</span>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          {connected ? (
            <Wifi className="h-3.5 w-3.5 text-success" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-destructive" />
          )}
          <span className={connected ? 'text-success' : 'text-destructive'}>
            {connected ? 'Connected' : 'Offline'}
          </span>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-1.5">
          <Battery className="h-3.5 w-3.5 text-primary" />
          <span className="text-foreground font-mono">{energy}%</span>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-warning" />
          <span className="text-secondary-foreground capitalize">{emotion}</span>
        </div>

        <div className="h-4 w-px bg-border" />

        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-medium capitalize">
          {personality}
        </span>
      </div>
    </header>
  );
};

export default TopBar;
