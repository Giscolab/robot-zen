import TopBar from '@/components/TopBar';
import Chat from '@/components/Chat';
import Robot3D from '@/components/Robot3D';
import ControlPanel from '@/components/ControlPanel';
import Terminal from '@/components/Terminal';

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopBar />
      <div className="flex-1 flex min-h-0">
        {/* Left: Chat */}
        <div className="w-80 border-r border-border flex flex-col">
          <Chat />
        </div>

        {/* Center: Robot 3D */}
        <div className="flex-1 flex flex-col">
          <Robot3D />
        </div>

        {/* Right: Controls + Terminal */}
        <div className="w-80 border-l border-border flex flex-col">
          <div className="flex-1 min-h-0 overflow-hidden">
            <ControlPanel />
          </div>
          <div className="h-56 border-t border-border">
            <Terminal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
