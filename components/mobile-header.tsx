"use client";

import { MenuIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Room } from "@/types/chat";

interface MobileHeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  activeRoom: Room | null;
}

export function MobileHeader({ isSidebarOpen, toggleSidebar, activeRoom }: MobileHeaderProps) {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b z-50 flex items-center px-4">
      {isSidebarOpen ? (
        <div className="flex-1">
          <h1 className="text-xl font-bold">Chats</h1>
        </div>
      ) : (
        <>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 ml-4">
            <h2 className="font-semibold truncate">{activeRoom?.name || "Select a chat"}</h2>
          </div>
        </>
      )}
      {isSidebarOpen && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <MenuIcon className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}