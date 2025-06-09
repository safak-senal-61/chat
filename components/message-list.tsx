"use client";

import { Message } from "@/types/chat";
import { MessageBubble } from "@/components/message-bubble";
import { TypingIndicator } from "@/components/typing-indicator";
import { groupMessagesByDate } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export function MessageList({ messages, isTyping }: MessageListProps) {
  const groupedMessages = groupMessagesByDate(messages);
  const currentUserId = 'current-user'; // In a real app, get this from auth

  return (
    <div className="space-y-6">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-2 text-xs text-muted-foreground">
                {date}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            {dateMessages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender.id === currentUserId}
              />
            ))}
          </div>
        </div>
      ))}
      
      {isTyping && (
        <div className="pl-12">
          <TypingIndicator />
        </div>
      )}
    </div>
  );
}