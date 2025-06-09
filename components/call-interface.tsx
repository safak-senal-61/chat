"use client";

import React, { useState, useEffect, RefObject } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CallState } from '@/types/chat';
import { cn } from '@/lib/utils';

// 1. Props arayüzünü Agora mimarisine göre güncelliyoruz
interface CallInterfaceProps {
  callState: CallState;
  localVideoRef: RefObject<HTMLVideoElement>;
  remoteVideoContainerRef: RefObject<HTMLDivElement>; // Artık bu bir container referansı
  onEndCall: () => void;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onStartScreenShare: () => void;
}

export function CallInterface({
  callState,
  localVideoRef,
  remoteVideoContainerRef, // remoteVideoRef yerine bunu kullanıyoruz
  onEndCall,
  onToggleVideo,
  onToggleAudio,
  onStartScreenShare,
}: CallInterfaceProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(callState.type === 'video');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  // Çağrı süresini hesapla
  useEffect(() => {
    if (callState.isActive && callState.startTime) {
      const interval = setInterval(() => {
        setCallDuration(Math.floor((new Date().getTime() - new Date(callState.startTime!).getTime()) / 1000));
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
    onToggleVideo();
    setIsVideoEnabled(prev => !prev);
  };

  const handleToggleAudio = () => {
    onToggleAudio();
    setIsAudioEnabled(prev => !prev);
  };

  const remoteUsers = callState.participants.slice(1); // Kendimiz hariç diğerleri

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/30">
        <div>
          <h3 className="font-semibold">Aramada</h3>
          <p className="text-sm text-gray-300">{formatDuration(callDuration)}</p>
        </div>
      </div>

      {/* Ana Video Alanı */}
      <div className="flex-1 relative">
        {/* Uzaktaki kullanıcıların videolarının ekleneceği konteyner */}
        <div 
          ref={remoteVideoContainerRef}
          className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4 place-items-center"
        >
          {/* Bu alan useAgora hook'u tarafından dinamik olarak doldurulacak */}
          {remoteUsers.length === 0 && (
            <div className="text-center text-gray-400">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Diğer katılımcılar bekleniyor...</p>
            </div>
          )}
        </div>

        {/* Kendi Videomuz (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-32 h-24 md:w-48 md:h-36 bg-black rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
        </div>
      </div>

      {/* Kontroller */}
      <div className="p-4 bg-black/50">
        <div className="flex items-center justify-center gap-4">
          <Button variant={isAudioEnabled ? "secondary" : "destructive"} size="icon" className="h-14 w-14 rounded-full" onClick={handleToggleAudio}>
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </Button>
          
          {callState.type === 'video' && (
            <Button variant={isVideoEnabled ? "secondary" : "destructive"} size="icon" className="h-14 w-14 rounded-full" onClick={handleToggleVideo}>
              {isVideoEnabled ? <Video /> : <VideoOff />}
            </Button>
          )}

          <Button variant="secondary" size="icon" className="h-14 w-14 rounded-full" onClick={onStartScreenShare}>
            <Monitor />
          </Button>

          <Button variant="destructive" size="icon" className="h-16 w-16 rounded-full" onClick={onEndCall}>
            <PhoneOff className="h-8 w-8"/>
          </Button>
        </div>
      </div>
    </div>
  );
}