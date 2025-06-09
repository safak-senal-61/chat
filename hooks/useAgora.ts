"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser, 
  IMicrophoneAudioTrack, 
  ICameraVideoTrack 
} from 'agora-rtc-sdk-ng';
import { useToast } from '@/hooks/use-toast';
import { User, CallState } from '@/types/chat';

interface UseAgoraOptions {
  currentUser: User;
  onCallStateChange: (state: CallState | ((prevState: CallState) => CallState)) => void;
}

export const useAgora = ({ currentUser, onCallStateChange }: UseAgoraOptions) => {
  const { toast } = useToast();

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTracksRef = useRef<(IMicrophoneAudioTrack | ICameraVideoTrack)[]>([]);
  
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement>(null);

  const cleanup = useCallback(async () => {
    const currentClient = clientRef.current;
    if (!currentClient) return;

    for (const track of localTracksRef.current) {
      track.stop();
      track.close();
    }
    
    // Olay dinleyicilerini temizle
    currentClient.removeAllListeners();
    
    await currentClient.leave();
    
    localTracksRef.current = [];
    setRemoteUsers([]);
    clientRef.current = null;
    
    onCallStateChange({ isActive: false, type: 'voice', participants: [] });
    console.log("Agora bağlantısı temizlendi.");
  }, [onCallStateChange]);
  
  const joinChannel = useCallback(async (channelName: string, type: 'voice' | 'video', targetUser: User) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if(!backendUrl) {
        toast({ title: 'Yapılandırma Hatası', description: 'Backend URL ayarlanmamış.', variant: 'destructive'});
        return;
    }
    
    try {
      toast({ title: 'Bağlanılıyor...', description: 'Giriş bileti alınıyor...' });
      
      // --- DEĞİŞİKLİK BURADA: Backend'e `uid` gönderiyoruz ---
      const tokenResponse = await fetch(`${backendUrl}/api/v1/agora/get-token?channelName=${channelName}&uid=${currentUser.id}`);
      
      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.error || 'Token sunucusundan yanıt alınamadı.');
      }
      const { token, appId } = await tokenResponse.json();

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'video') {
          setRemoteUsers(prev => {
            if (prev.find(u => u.uid === user.uid)) return prev; // Zaten varsa ekleme
            return [...prev, user];
          });
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });
      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video') {
           setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        }
      });
      client.on('user-left', user => {
        toast({ title: "Kullanıcı Ayrıldı", description: `Kullanıcı ${user.uid} aramadan ayrıldı.` });
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      });

      await client.join(appId, channelName, token, currentUser.id);
      
      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
      localTracksRef.current = tracks;
      
      if (localVideoRef.current && tracks[1]) { // tracks[1] kameradır
        tracks[1].play(localVideoRef.current);
      }
      
      await client.publish(tracks);
      
      onCallStateChange({ isActive: true, type, participants: [currentUser, targetUser], startTime: new Date().toISOString() });
      toast({ title: 'Bağlantı Başarılı', description: `Kanala katıldınız: ${channelName}` });

    } catch (error) {
      console.error("Katılım sırasında hata oluştu:", error);
      toast({ title: 'Katılım Başarısız Oldu', description: (error as Error).message, variant: 'destructive' });
      await cleanup();
    }
  }, [currentUser, onCallStateChange, toast, cleanup]);

  const leaveChannel = useCallback(async () => {
    await cleanup();
    toast({ title: 'Aramadan ayrıldınız' });
  }, [cleanup, toast]);

  useEffect(() => {
    const container = remoteVideoContainerRef.current;
    if (!container) return;
    
    // Bu effect remoteUsers her değiştiğinde çalışır ve DOM'u günceller
    container.innerHTML = ''; // Önce temizle
    remoteUsers.forEach(user => {
      if (user.videoTrack) {
        const playerContainer = document.createElement("div");
        playerContainer.id = `player-container-${user.uid}`;
        playerContainer.className = 'remote-player'; // Stil için
        container.append(playerContainer);
        user.videoTrack.play(playerContainer);
      }
    });
  }, [remoteUsers]);
  
  const toggleAudio = useCallback(() => {
    if (localTracksRef.current[0]) {
      const newEnabledState = !localTracksRef.current[0].enabled;
      localTracksRef.current[0].setEnabled(newEnabledState);
      toast({ title: newEnabledState ? 'Mikrofon Açıldı' : 'Mikrofon Kapatıldı' });
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (localTracksRef.current[1]) {
      const newEnabledState = !localTracksRef.current[1].enabled;
      localTracksRef.current[1].setEnabled(newEnabledState);
      toast({ title: newEnabledState ? 'Kamera Açıldı' : 'Kamera Kapatıldı' });
    }
  }, []);

  return {
    joinChannel,
    leaveChannel,
    localVideoRef,
    remoteVideoContainerRef,
    toggleAudio,
    toggleVideo,
    startScreenShare: () => toast({ title: "Özellik Geliştiriliyor" }),
  };
};