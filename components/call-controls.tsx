"use client";

import { Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/types/chat';

interface CallControlsProps {
  targetUser: User;
  roomId?: string;
  onStartCall: (type: 'voice' | 'video', targetUser: User, roomId?: string) => void;
  disabled?: boolean;
}

export function CallControls({ 
  targetUser, 
  roomId, 
  onStartCall, 
  disabled = false 
}: CallControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Voice Call */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-green-500/20 hover:text-green-600"
        onClick={() => onStartCall('voice', targetUser, roomId)}
        disabled={disabled || !targetUser.isOnline}
        title={targetUser.isOnline ? "Start voice call" : "User is offline"}
      >
        <Phone className="h-4 w-4" />
      </Button>

      {/* Video Call */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-blue-500/20 hover:text-blue-600"
        onClick={() => onStartCall('video', targetUser, roomId)}
        disabled={disabled || !targetUser.isOnline}
        title={targetUser.isOnline ? "Start video call" : "User is offline"}
      >
        <Video className="h-4 w-4" />
      </Button>
    </div>
  );
}