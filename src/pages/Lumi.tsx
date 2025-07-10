import React, { useState } from 'react';
import { ChatWindow } from '@/components/lumi/ChatWindow';
import { LumiSidebar } from '@/components/lumi/LumiSidebar';
import { LumiProvider } from '@/contexts/LumiContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

const LumiPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <LumiProvider>
      <div className="h-screen flex bg-background">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between p-4 border-b lg:hidden">
            <h1 className="text-lg font-semibold">Lumi</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRightOpen className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <ChatWindow className="flex-1" />
        </div>

        {/* Sidebar */}
        <div className={cn(
          'transition-all duration-300 ease-in-out',
          sidebarOpen ? 'w-80' : 'w-0',
          'lg:w-80 lg:block',
          !sidebarOpen && 'lg:w-80' // Always show on large screens
        )}>
          <LumiSidebar className={cn(
            'h-full',
            !sidebarOpen && 'hidden lg:flex'
          )} />
        </div>

        {/* Sidebar Toggle Button - Desktop */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            'fixed top-4 right-4 z-50 hidden lg:flex',
            'bg-background/80 backdrop-blur-sm border shadow-md'
          )}
        >
          {sidebarOpen ? (
            <PanelRightClose className="h-4 w-4" />
          ) : (
            <PanelRightOpen className="h-4 w-4" />
          )}
        </Button>
      </div>
    </LumiProvider>
  );
};

export default LumiPage;
