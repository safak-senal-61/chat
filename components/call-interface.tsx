"use client";

import { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor,
  Minimize2,
  Maximize2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CallState, User } from '@/types/chat';
import { cn } from '@/lib/utils';

interface CallInterfaceProps {
  callState: CallState;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  onEndCall: () => void;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onStartScreenShare: () => void;
  isConnecting: boolean;
  connectionState: RTCPeerConnectionState;
}

export function CallInterface({
  callState,
  localVideoRef,
  remoteVideoRef,
  onEndCall,
  onToggleVideo,
  onToggleAudio,
  onStartScreenShare,
  isConnecting,
  connectionState
}: CallInterfaceProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(callState.type === 'video');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Calculate call duration
  useEffect(() => {
    if (callState.isActive && callState.startTime) {
      const interval = setInterval(() => {
        const start = new Date(callState.startTime!).getTime();
        const now = new Date().getTime();
        setCallDuration(Math.floor((now - start) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [callState.isActive, callState.startTime]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    onToggleVideo();
  };

  const handleToggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    onToggleAudio();
  };

  const remoteUser = callState.participants.find(p => p.id !== 'current-user');

  if (!callState.isActive) return null;

  return (
    <div className={cn(
      "fixed inset-0 bg-black z-50 flex flex-col",
      isMinimized && "bottom-4 right-4 top-auto left-auto w-80 h-60 rounded-lg overflow-hidden shadow-2xl"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 text-white">
        <div className="flex items-center gap-3">
          {remoteUser && (
            <>
              <Avatar className="h-10 w-10">
                <AvatarImage src={remoteUser.avatar} />
                <AvatarFallback>{remoteUser.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{remoteUser.name}</h3>
                <p className="text-sm text-gray-300">
                  {isConnecting ? 'Bağlanıyor...' : 
                   connectionState === 'connected' ? formatDuration(callDuration) :
                   connectionState === 'connecting' ? 'Bağlanıyor...' :
                   'Çağrı devam ediyor'}
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20"
          >
            {isMinimized ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-gray-900">
        {callState.type === 'video' ? (
          <>
            {/* Remote Video (Main) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }} // Mirror effect
            />
            
            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }} // Mirror effect
              />
            </div>
          </>
        ) : (
          /* Voice Call UI */
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              {remoteUser && (
                <>
                  <Avatar className="h-32 w-32 mx-auto mb-6">
                    <AvatarImage src={remoteUser.avatar} />
                    <AvatarFallback className="text-4xl">{remoteUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-semibold mb-2">{remoteUser.name}</h2>
                  <p className="text-gray-300">
                    {isConnecting ? 'Bağlanıyor...' : formatDuration(callDuration)}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Connection Status Overlay */}
        {(isConnecting || connectionState !== 'connected') && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg">
                {connectionState === 'connecting' ? 'Bağlanıyor...' :
                 connectionState === 'disconnected' ? 'Yeniden bağlanıyor...' :
                 'Bağlantı kuruluyor...'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/80">
        <div className="flex items-center justify-center gap-4">
          {/* Audio Toggle */}
          <Button
            variant={isAudioEnabled ? "secondary" : "destructive"}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={handleToggleAudio}
          >
            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>

          {/* Video Toggle (only for video calls) */}
          {callState.type === 'video' && (
            <Button
              variant={isVideoEnabled ? "secondary" : "destructive"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={handleToggleVideo}
            >
              {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
          )}

          {/* Screen Share */}
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={onStartScreenShare}
          >
            <Monitor className="h-5 w-5" />
          </Button>

          {/* Settings */}
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full"
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* End Call */}
          <Button
            variant="destructive"
            size="icon"
            className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600"
            onClick={onEndCall}
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}