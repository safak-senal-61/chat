"use client";

import { Room } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Lock, Users } from "lucide-react";

interface RoomListProps {
  rooms: Room[];
  activeRoomId: string | undefined;
  onSelectRoom: (room: Room) => void;
}

export function RoomList({ rooms, activeRoomId, onSelectRoom }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center p-4">
        <p className="text-sm text-muted-foreground mb-2">No conversations found</p>
        <p className="text-xs text-muted-foreground">Try creating a new chat or group</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {rooms.map(room => (
        <div
          key={room.id}
          className={cn(
            "flex items-center p-2 rounded-lg cursor-pointer transition-colors",
            "hover:bg-muted/60",
            activeRoomId === room.id && "bg-muted"
          )}
          onClick={() => onSelectRoom(room)}
        >
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={room.avatar} />
            <AvatarFallback>{room.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="ml-3 flex-1 overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="flex items-center max-w-[70%]">
                <h3 className="font-medium truncate">{room.name}</h3>
                {room.isPasswordProtected && (
                  <Lock className="h-3 w-3 ml-1 text-muted-foreground" />
                )}
                {room.isGroup && (
                  <Users className="h-3 w-3 ml-1 text-muted-foreground" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(room.lastActivity)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground truncate max-w-[80%]">
                {room.lastMessage}
              </p>
              {room.unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {room.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}