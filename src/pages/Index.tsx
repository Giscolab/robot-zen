import { useState } from 'react';
import TopBar from '@/components/TopBar';
import Chat from '@/components/Chat';
import Robot3D from '@/components/Robot3D';
import ControlPanel from '@/components/ControlPanel';
import Terminal from '@/components/Terminal';
import Face from '@/components/Face';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, SlidersHorizontal, TerminalSquare } from 'lucide-react';

const Index = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <TopBar />
        <div className="h-64 relative">
          <Robot3D />
          <Face />
        </div>
        <Tabs defaultValue="chat" className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-2 mt-1 shrink-0">
            <TabsTrigger value="chat" className="gap-1.5 text-xs">
              <MessageSquare className="h-3.5 w-3.5" /> Chat
            </TabsTrigger>
            <TabsTrigger value="controls" className="gap-1.5 text-xs">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Contrôles
            </TabsTrigger>
            <TabsTrigger value="terminal" className="gap-1.5 text-xs">
              <TerminalSquare className="h-3.5 w-3.5" /> Terminal
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex-1 min-h-0 m-0">
            <Chat />
          </TabsContent>
          <TabsContent value="controls" className="flex-1 min-h-0 m-0 overflow-auto">
            <ControlPanel />
          </TabsContent>
          <TabsContent value="terminal" className="flex-1 min-h-0 m-0">
            <Terminal />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopBar />
      <div className="flex-1 flex min-h-0">
        {/* Left: Chat */}
        <div className="w-80 border-r border-border flex flex-col">
          <Chat />
        </div>

        {/* Center: Robot 3D + Face overlay */}
        <div className="flex-1 flex flex-col relative">
          <Robot3D />
          <Face />
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
