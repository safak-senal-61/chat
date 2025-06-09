"use client";

import { useState, useEffect } from 'react';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CallState } from '@/types/chat';

interface IncomingCallDialogProps {
  callState: CallState;
  onAcceptCall: (withVideo: boolean) => void;
  onDeclineCall: () => void;
}

export function IncomingCallDialog({ 
  callState, 
  onAcceptCall, 
  onDeclineCall 
}: IncomingCallDialogProps) {
  const [isRinging, setIsRinging] = useState(true);

  useEffect(() => {
    // Play ringtone sound (in a real app)
    const audio = new Audio('/ringtone.mp3'); // You'd need to add this file
    audio.loop = true;
    
    if (callState.isIncoming && callState.isActive) {
      audio.play().catch(() => {
        // Handle autoplay restrictions
        console.log('Could not play ringtone');
      });
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [callState.isIncoming, callState.isActive]);

  if (!callState.isIncoming || !callState.isActive) return null;

  const caller = callState.caller;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-card rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="mb-6">
          <div className={`mx-auto mb-4 ${isRinging ? 'animate-pulse' : ''}`}>
            {caller && (
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={caller.avatar} />
                <AvatarFallback className="text-2xl">{caller.name[0]}</AvatarFallback>
              </Avatar>
            )}
          </div>
          
          <h2 className="text-xl font-semibold mb-2">
            {caller?.name || 'Unknown Caller'}
          </h2>
          
          <p className="text-muted-foreground">
            Incoming {callState.type} call...
          </p>
        </div>

        <div className="flex justify-center gap-6">
          {/* Decline Call */}
          <Button
            variant="destructive"
            size="icon"
            className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
            onClick={onDeclineCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>

          {/* Accept Voice Call */}
          <Button
            variant="default"
            size="icon"
            className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600"
            onClick={() => onAcceptCall(false)}
          >
            <Phone className="h-6 w-6" />
          </Button>

          {/* Accept Video Call (if it's a video call) */}
          {callState.type === 'video' && (
            <Button
              variant="default"
              size="icon"
              className="h-16 w-16 rounded-full bg-blue-500 hover:bg-blue-600"
              onClick={() => onAcceptCall(true)}
            >
              <Video className="h-6 w-6" />
            </Button>
          )}
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          {callState.type === 'video' ? 
            'Tap phone to answer with audio only, or video to answer with video' :
            'Tap to answer the call'
          }
        </div>
      </div>
    </div>
  );
}