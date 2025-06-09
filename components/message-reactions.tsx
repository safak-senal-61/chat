"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MessageReactionsProps {
  messageId: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
  onAddReaction: (messageId: string, emoji: string) => void;
}

const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export function MessageReactions({ messageId, reactions = [], onAddReaction }: MessageReactionsProps) {
  const [showQuickReactions, setShowQuickReactions] = useState(false);

  return (
    <div className="flex items-center gap-1 mt-1">
      {reactions.map((reaction, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs rounded-full"
          onClick={() => onAddReaction(messageId, reaction.emoji)}
        >
          <span className="mr-1">{reaction.emoji}</span>
          {reaction.count}
        </Button>
      ))}
      
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-full"
          onClick={() => setShowQuickReactions(!showQuickReactions)}
        >
          <Plus className="h-3 w-3" />
        </Button>
        
        {showQuickReactions && (
          <div className="absolute bottom-8 left-0 bg-card border rounded-lg shadow-lg p-2 flex gap-1 z-50">
            {quickReactions.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  onAddReaction(messageId, emoji);
                  setShowQuickReactions(false);
                }}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}