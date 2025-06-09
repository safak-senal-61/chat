"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useToast } from '@/hooks/use-toast';
import { User, CallState } from '@/types/chat';

// Simple-Peer import (we'll use the CDN version like in your working example)
declare global {
  interface Window {
    SimplePeer: any;
  }
}

interface UseWebRTCOptions {
  currentUser: User;
  onCallStateChange: (state: CallState | ((prevState: CallState) => CallState)) => void;
}

export const useWebRTC = ({ currentUser, onCallStateChange }: UseWebRTCOptions) => {
  const { socket, isConnected } = useSocket();
  const { toast } = useToast();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<any>(null);
  const currentRoomRef = useRef<string | null>(null);

  // Load SimplePeer from CDN (like in your working example)
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.SimplePeer) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/simple-peer/simplepeer.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const cleanupPeer = useCallback(() => {
    console.log('🧹 Peer bağlantısı temizleniyor...');
    
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    setConnectionState('closed');
    setIsConnecting(false);
    
    onCallStateChange({
      isActive: false,
      isIncoming: false,
      participants: [],
      type: 'voice',
      offerPayload: null
    });
  }, [remoteStream, onCallStateChange]);

  const setupPeerEvents = useCallback((peer: any) => {
    peer.on('error', (err: any) => {
      console.error('❌ Peer hatası:', err);
      toast({
        title: "Bağlantı Hatası",
        description: "Peer bağlantısında hata oluştu",
        variant: "destructive"
      });
      cleanupPeer();
    });

    peer.on('connect', () => {
      console.log('✅ PEER BAĞLANTISI KURULDU!');
      setConnectionState('connected');
      setIsConnecting(false);
      toast({
        title: "Bağlantı Kuruldu",
        description: "Video çağrısı başarıyla bağlandı",
      });
    });

    peer.on('stream', (stream: MediaStream) => {
      console.log('➡️ Karşıdan video akışı alındı!');
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    });

    peer.on('close', () => {
      console.log('🔌 Peer bağlantısı kapandı');
      cleanupPeer();
    });
  }, [cleanupPeer, toast]);

  // Socket event listeners (based on your working simple-peer code)
  useEffect(() => {
    if (!socket) return;

    // Odada başka kullanıcı var, biz bağlantıyı başlatacağız
    const handleOtherUser = (otherUserID: string) => {
      console.log(`👥 Diğer kullanıcı bulundu: ${otherUserID}. Bağlantıyı başlatıyorum.`);
      
      if (!window.SimplePeer || !localStream) {
        console.error('SimplePeer veya localStream hazır değil');
        return;
      }

      if (peerRef.current) return; // Zaten bir peer var

      setIsConnecting(true);
      
      const peer = new window.SimplePeer({
        initiator: true,
        trickle: false,
        stream: localStream,
      });

      peer.on('signal', (data: any) => {
        console.log('📤 Offer gönderiliyor...');
        socket.emit('offer', {
          target: otherUserID,
          caller: socket.id,
          signal: data,
        });
      });

      setupPeerEvents(peer);
      peerRef.current = peer;
    };

    // Gelen offer (teklif)
    const handleOffer = (payload: { caller: string; signal: any }) => {
      console.log(`📥 Gelen offer: ${payload.caller}`);
      
      if (!window.SimplePeer || !localStream) {
        console.error('SimplePeer veya localStream hazır değil');
        return;
      }

      if (peerRef.current) return; // Zaten bir peer var

      setIsConnecting(true);
      
      const peer = new window.SimplePeer({
        initiator: false,
        trickle: false,
        stream: localStream,
      });

      peer.signal(payload.signal);

      peer.on('signal', (data: any) => {
        console.log('📤 Answer gönderiliyor...');
        socket.emit('answer', {
          target: payload.caller,
          caller: socket.id,
          signal: data,
        });
      });

      setupPeerEvents(peer);
      peerRef.current = peer;
    };

    // Gelen answer (cevap)
    const handleAnswer = (payload: { signal: any }) => {
      console.log('📥 Answer alındı');
      if (peerRef.current) {
        peerRef.current.signal(payload.signal);
      }
    };

    // Peer ayrıldı
    const handlePeerDisconnected = () => {
      console.log('👋 Peer ayrıldı');
      toast({
        title: "Çağrı Sonlandı",
        description: "Diğer kullanıcı çağrıdan ayrıldı",
      });
      cleanupPeer();
    };

    // Oda dolu
    const handleRoomFull = () => {
      toast({
        title: "Oda Dolu",
        description: "Bu oda şu anda dolu, lütfen daha sonra tekrar deneyin",
        variant: "destructive"
      });
    };

    socket.on('other user', handleOtherUser);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('peer disconnected', handlePeerDisconnected);
    socket.on('room full', handleRoomFull);

    return () => {
      socket.off('other user', handleOtherUser);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('peer disconnected', handlePeerDisconnected);
      socket.off('room full', handleRoomFull);
    };
  }, [socket, localStream, setupPeerEvents, cleanupPeer, toast]);

  const startCall = useCallback(async (type: 'video' | 'voice', targetUser: User, roomId?: string) => {
    if (!isConnected) {
      throw new Error("Socket sunucusuna bağlı değil");
    }

    if (!window.SimplePeer) {
      throw new Error("SimplePeer kütüphanesi yüklenmedi");
    }

    try {
      console.log(`🎥 ${type} çağrısı başlatılıyor...`);
      
      // Kamera ve mikrofon erişimi
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === 'video',
        audio: true
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Call state'i güncelle
      onCallStateChange({
        isActive: true,
        isIncoming: false,
        type,
        participants: [currentUser, targetUser],
        startTime: new Date().toISOString()
      });

      // Odaya katıl (simple-peer mantığına göre)
      const room = roomId || `call-${currentUser.id}-${targetUser.id}`;
      currentRoomRef.current = room;
      
      console.log(`🏠 Odaya katılıyorum: ${room}`);
      socket.emit('join room', room);

    } catch (error) {
      console.error("Medya erişim hatası:", error);
      throw new Error("Kamera/mikrofon izni gerekli");
    }
  }, [isConnected, currentUser, onCallStateChange, socket]);

  const answerCall = useCallback(async (offerPayload: any) => {
    // Bu fonksiyon simple-peer mantığında otomatik olarak çalışıyor
    // Çünkü socket event'leri zaten offer'ları handle ediyor
    console.log('📞 Çağrı otomatik olarak yanıtlanıyor...');
  }, []);

  const endCall = useCallback(() => {
    console.log('📴 Çağrı sonlandırılıyor...');
    
    // Local stream'i durdur
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    // Odadan ayrıl
    if (currentRoomRef.current && socket) {
      socket.emit('leave room', currentRoomRef.current);
      currentRoomRef.current = null;
    }

    cleanupPeer();
    
    toast({
      title: "Çağrı Sonlandı",
      description: "Video çağrısı sonlandırıldı",
    });
  }, [localStream, socket, cleanupPeer, toast]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
  }, [localStream]);

  return {
    localStream,
    remoteStream,
    isConnecting,
    connectionState,
    localVideoRef,
    remoteVideoRef,
    isSocketConnected: isConnected,
    startCall,
    answerCall,
    endCall,
    toggleAudio,
    toggleVideo,
    startScreenShare: () => {
      toast({
        title: "Özellik Geliştiriliyor",
        description: "Ekran paylaşımı özelliği yakında eklenecek",
      });
    },
  };
};