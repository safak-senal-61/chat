"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat";

interface SearchMessagesProps {
  messages: Message[];
  onMessageSelect: (messageId: string) => void;
  onClose: () => void;
}

export function SearchMessages({ messages, onMessageSelect, onClose }: SearchMessagesProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute inset-0 bg-card border-l z-50">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {searchQuery && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredMessages.length} result{filteredMessages.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            </div>
          )}

          <div className="space-y-2">
            {filteredMessages.map(message => (
              <div
                key={message.id}
                className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                onClick={() => onMessageSelect(message.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{message.sender.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {message.content}
                </p>
              </div>
            ))}
          </div>

          {searchQuery && filteredMessages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No messages found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}