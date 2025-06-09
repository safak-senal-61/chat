'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
  currentUser: any | null;
  retryConnection: () => void;
  connectionLogs: string[];
  clearLogs: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionError: null,
  currentUser: null,
  retryConnection: () => {},
  connectionLogs: [],
  clearLogs: () => {},
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [connectionLogs, setConnectionLogs] = useState<string[]>([]);

  const socketInitialized = useRef(false);

  const addLog = (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = {
      info: '📝',
      error: '❌',
      success: '✅',
      warning: '⚠️'
    }[type];
    
    const logMessage = `${emoji} [${timestamp}] ${message}`;
    console.log(logMessage);
    
    setConnectionLogs(prev => [...prev.slice(-49), logMessage]);
  };

  const clearLogs = () => {
    setConnectionLogs([]);
    addLog('Loglar temizlendi', 'info');
  };

  const initializeSocket = () => {
    if (socketInitialized.current) {
      addLog('Socket zaten başlatılmış, tekrar başlatma atlanıyor', 'warning');
      return;
    }

    addLog('🚀 Socket bağlantısı başlatılıyor...', 'info');

    // Backend URL'i environment'dan al
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://3000-firebase-websachat-backend-1748272624869.cluster-6vyo4gb53jczovun3dxslzjahs.cloudworkstations.dev';
    addLog(`🌐 Backend URL: ${backendUrl}`, 'info');

    // Browser ve network bilgileri
    addLog(`🌍 User Agent: ${navigator.userAgent.slice(0, 50)}...`, 'info');
    addLog(`🔗 Current URL: ${window.location.href}`, 'info');
    addLog(`🍪 Cookies: ${document.cookie ? 'Var' : 'Yok'}`, 'info');

    // Mock user setup
    const mockUser = {
      userId: 'cmbm78nr20001m8o7i47618u8',
      username: 'safaksenall',
      email: 'jewelkaan01@gmail.com',
      role: 'USER',
    };
    setCurrentUser(mockUser);
    addLog(`👤 Mock user oluşturuldu: ${mockUser.username}`, 'success');

    setConnectionError(null);

    // Socket.IO configuration with detailed logging
    const socketConfig = {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 5,
      randomizationFactor: 0.5,
    };

    addLog(`⚙️ Socket config: ${JSON.stringify(socketConfig, null, 2)}`, 'info');

    const socketInstance = io(backendUrl, socketConfig);

    // Detailed connection events
    socketInstance.on('connect', () => {
      addLog(`✅ BAŞARILI BAĞLANTI! Socket ID: ${socketInstance.id}`, 'success');
      addLog(`🚀 Transport: ${socketInstance.io.engine.transport.name}`, 'success');
      addLog(`🔄 Upgrade: ${socketInstance.io.engine.upgrade}`, 'info');
      addLog(`📡 Protocol: ${socketInstance.protocol}`, 'info');
      
      setSocket(socketInstance);
      setIsConnected(true);
      setConnectionError(null);
    });

    socketInstance.on('connect_error', (error) => {
      addLog(`❌ BAĞLANTI HATASI: ${error.message}`, 'error');
      addLog(`🔍 Error type: ${error.type}`, 'error');
      addLog(`📋 Error description: ${JSON.stringify(error.description)}`, 'error');
      addLog(`🌐 Error context: ${JSON.stringify(error.context)}`, 'error');
      
      setIsConnected(false);
      setConnectionError(`Bağlantı hatası: ${error.message}`);
    });

    socketInstance.on('disconnect', (reason, details) => {
      addLog(`🔌 BAĞLANTI KESİLDİ: ${reason}`, 'warning');
      if (details) {
        addLog(`📋 Disconnect details: ${JSON.stringify(details)}`, 'warning');
      }
      setIsConnected(false);
    });

    // Reconnection events
    socketInstance.on('reconnect', (attemptNumber) => {
      addLog(`🔄 YENİDEN BAĞLANDI (deneme ${attemptNumber})`, 'success');
      setConnectionError(null);
    });

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      addLog(`🔄 Yeniden bağlanma denemesi ${attemptNumber}`, 'info');
    });

    socketInstance.on('reconnect_error', (error) => {
      addLog(`❌ Yeniden bağlanma hatası: ${error.message}`, 'error');
      setConnectionError(`Yeniden bağlanma hatası: ${error.message}`);
    });

    socketInstance.on('reconnect_failed', () => {
      addLog('💀 YENİDEN BAĞLANMA BAŞARISIZ', 'error');
      setConnectionError('Yeniden bağlanma başarısız oldu');
    });

    // Engine events for detailed debugging
    socketInstance.io.on('error', (error) => {
      addLog(`🔧 Engine hatası: ${error}`, 'error');
    });

    socketInstance.io.on('ping', () => {
      addLog('🏓 Ping gönderildi', 'info');
    });

    socketInstance.io.on('pong', (latency) => {
      addLog(`🏓 Pong alındı (gecikme: ${latency}ms)`, 'success');
    });

    // Transport events
    socketInstance.io.engine.on('upgrade', () => {
      addLog(`⬆️ Transport upgrade: ${socketInstance.io.engine.transport.name}`, 'success');
    });

    socketInstance.io.engine.on('upgradeError', (error) => {
      addLog(`❌ Transport upgrade hatası: ${error.message}`, 'error');
    });

    socketInstance.io.engine.on('open', () => {
      addLog('🔓 Engine açıldı', 'success');
    });

    socketInstance.io.engine.on('close', (reason) => {
      addLog(`🔒 Engine kapandı: ${reason}`, 'warning');
    });

    socketInstance.io.engine.on('packet', (packet) => {
      addLog(`📦 Packet: ${packet.type} - ${JSON.stringify(packet.data).slice(0, 100)}`, 'info');
    });

    socketInstance.io.engine.on('packetCreate', (packet) => {
      addLog(`📤 Packet oluşturuldu: ${packet.type}`, 'info');
    });

    // WebRTC signaling events (based on your working simple-peer code)
    socketInstance.on('other user', (otherUserID) => {
      addLog(`👥 Diğer kullanıcı bulundu: ${otherUserID}`, 'info');
    });

    socketInstance.on('offer', (payload) => {
      addLog(`📞 Gelen offer: ${payload.caller} -> ${socketInstance.id}`, 'info');
    });

    socketInstance.on('answer', (payload) => {
      addLog(`📞 Gelen answer: ${payload.caller} -> ${socketInstance.id}`, 'info');
    });

    socketInstance.on('peer disconnected', () => {
      addLog('👋 Peer bağlantısı kesildi', 'warning');
    });

    socketInstance.on('room full', () => {
      addLog('🏠 Oda dolu', 'warning');
    });

    // Test connection after 3 seconds
    setTimeout(() => {
      if (socketInstance.connected) {
        addLog('🧪 Test bağlantısı gönderiliyor...', 'info');
        socketInstance.emit('ping', Date.now(), (response: any) => {
          addLog(`🏓 Ping response: ${JSON.stringify(response)}`, 'success');
        });
      } else {
        addLog('⚠️ 3 saniye sonra hala bağlantı yok', 'warning');
        
        // Manual connection attempt
        addLog('🔄 Manuel bağlantı denemesi...', 'info');
        socketInstance.connect();
      }
    }, 3000);

    socketInitialized.current = true;

    return () => {
      addLog('🧹 Cleanup: Socket bağlantısı kesiliyor', 'info');
      socketInstance.disconnect();
      socketInitialized.current = false;
    };
  };

  const retryConnection = () => {
    addLog('🔄 Manuel yeniden bağlanma denemesi başlatılıyor...', 'info');
    setConnectionError(null);
    
    if (socket) {
      addLog('🔌 Mevcut socket bağlantısı kesiliyor...', 'info');
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
    
    socketInitialized.current = false;
    
    setTimeout(() => {
      addLog('🚀 Yeni socket bağlantısı başlatılıyor...', 'info');
      initializeSocket();
    }, 1000);
  };

  useEffect(() => {
    addLog('🎬 SocketProvider useEffect çalışıyor', 'info');
    const cleanup = initializeSocket();
    return cleanup;
  }, []);

  const contextValue = useMemo(
    () => ({
      socket,
      isConnected,
      connectionError,
      currentUser,
      retryConnection,
      connectionLogs,
      clearLogs,
    }),
    [socket, isConnected, connectionError, currentUser, connectionLogs]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};