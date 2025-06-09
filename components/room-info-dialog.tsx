"use client";

import { Room } from "@/types/chat";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { UserStatus } from "@/components/user-status";

interface RoomInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
}

export function RoomInfoDialog({ isOpen, onClose, room }: RoomInfoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Room Information</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center mb-4">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={room.avatar} />
            <AvatarFallback>{room.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{room.name}</h2>
          <div className="flex gap-2 mt-2">
            {room.isGroup && (
              <Badge variant="outline">Group</Badge>
            )}
            {room.isPasswordProtected && (
              <Badge variant="outline">Password Protected</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Created {formatDate(room.createdAt)}
          </p>
        </div>
        
        {room.participants && room.participants.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">{room.isGroup ? "Participants" : "Chat with"}</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {room.participants.map(participant => (
                  <div 
                    key={participant.id}
                    className="flex items-center p-2 rounded hover:bg-muted"
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{participant.name}</div>
                      <UserStatus 
                        status={participant.isOnline ? "active" : "offline"} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}