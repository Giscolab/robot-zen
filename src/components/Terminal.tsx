import { useState, useRef, useEffect } from 'react';
import { TerminalSquare } from 'lucide-react';
import { useRobotStore } from '@/stores/robotStore';

const Terminal = () => {
  const { terminalLines, processCommand } = useRobotStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [terminalLines]);

  const submit = () => {
    if (!input.trim()) return;
    processCommand(input.trim());
    setInput('');
  };

  const lineColor = (type: string) => {
    switch (type) {
      case 'input': return 'text-primary';
      case 'error': return 'text-destructive';
      case 'system': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <TerminalSquare className="h-3.5 w-3.5 text-primary" />
        <span>Terminal</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-0.5">
        {terminalLines.map((line) => (
          <div key={line.id} className={lineColor(line.type)}>
            {line.text}
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-border">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-primary">$</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Enter command..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
