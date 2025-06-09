"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoomList } from "@/components/room-list";
import { UserProfile } from "@/components/user-profile";
import { CreateRoomDialog } from "@/components/create-room-dialog";
import { Room } from "@/types/chat";
import { mockRooms } from "@/lib/mock-data";

interface ChatSidebarProps {
  activeRoom: Room | null;
  onSelectRoom: (room: Room) => void;
  onCreateRoom: (room: Room) => void;
}

export function ChatSidebar({ activeRoom, onSelectRoom, onCreateRoom }: ChatSidebarProps) {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRoom = (room: Room) => {
    const newRoom = {
      ...room,
      id: `room-${rooms.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    
    setRooms([...rooms, newRoom]);
    onCreateRoom(newRoom);
    setIsCreateRoomOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold mb-4">Chats</h1>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex justify-between items-center px-2 mb-2">
          <h2 className="text-sm font-semibold text-muted-foreground">RECENT CHATS</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsCreateRoomOpen(true)}>
            <span className="sr-only">Create new chat</span>
            <svg 
              width="15" 
              height="15" 
              viewBox="0 0 15 15" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" />
            </svg>
          </Button>
        </div>
        <RoomList 
          rooms={filteredRooms} 
          activeRoomId={activeRoom?.id}
          onSelectRoom={onSelectRoom} 
        />
      </div>
      
      <UserProfile />
      
      <CreateRoomDialog 
        isOpen={isCreateRoomOpen} 
        onClose={() => setIsCreateRoomOpen(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}