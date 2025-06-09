"use client";

import { useState } from "react";
import { formatTime } from "@/lib/utils";
import { Message } from "@/types/chat";
import { CheckCheck, Check, EllipsisVertical, Copy, Reply, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VoiceMessagePlayer } from "@/components/voice-message-player";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />;
      default:
        return null;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  // Check if message is a voice message
  const isVoiceMessage = message.type === 'voice' && message.audioBlob;

  return (
    <div 
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex max-w-[80%] ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        {!isOwn && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={message.sender.avatar} />
            <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
          </Avatar>
        )}
        
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          {!isOwn && (
            <span className="text-xs text-muted-foreground ml-2 mb-1">{message.sender.name}</span>
          )}
          <div className="relative">
            {isVoiceMessage ? (
              <VoiceMessagePlayer 
                audioBlob={message.audioBlob!} 
                duration={message.duration}
                isOwn={isOwn}
              />
            ) : (
              <div 
                className={`rounded-2xl p-3 ${
                  isOwn 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-secondary text-secondary-foreground rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            )}
            
            <div className={`flex items-center mt-1 text-xs text-muted-foreground ${isOwn ? 'justify-end mr-1' : 'justify-start ml-1'}`}>
              <span>{formatTime(message.timestamp)}</span>
              {isOwn && getStatusIcon()}
            </div>
          </div>
        </div>
        
        {/* Message Actions */}
        <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${isOwn ? 'mr-2' : 'ml-2'}`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-7 w-7 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors">
                <EllipsisVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isOwn ? "end" : "start"}>
              {!isVoiceMessage && (
                <DropdownMenuItem onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}