"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types/chat";

interface OnlineUsersProps {
  users: User[];
}

export function OnlineUsers({ users }: OnlineUsersProps) {
  const onlineUsers = users.filter(user => user.isOnline);

  if (onlineUsers.length === 0) {
    return null;
  }

  return (
    <div className="border-l bg-card/50 w-64 p-4">
      <h3 className="font-semibold mb-4">Online ({onlineUsers.length})</h3>
      <ScrollArea className="h-full">
        <div className="space-y-3">
          {onlineUsers.map(user => (
            <div key={user.id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
              </div>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}