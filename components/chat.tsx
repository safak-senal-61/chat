"use client";

import { useState } from "react";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatArea } from "@/components/chat-area";
import { MobileHeader } from "@/components/mobile-header";
import { CallInterface } from "@/components/call-interface";
import { IncomingCallDialog } from "@/components/incoming-call-dialog";
import { DebugPanel } from "@/components/debug-panel";
import { Room, NotificationSettings, ScheduledMessage, CallState, User } from "@/types/chat";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";
import { useWebRTC } from "@/hooks/use-webrtc";
import { useSocket } from "@/contexts/SocketContext";

export function Chat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    type: 'voice',
    participants: [],
    isIncoming: false,
    offerPayload: null,
  });

  const [globalNotificationSettings, setGlobalNotificationSettings] = useState<NotificationSettings>({
    directMessages: 'all',
    groupChats: 'mentions',
    soundEnabled: true,
    desktopNotifications: true,
    emailNotifications: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });
  
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { toast } = useToast();
  const { socket, isConnected, connectionError, retryConnection } = useSocket();
  const currentUserId = 'current-user';
  
  const currentUser: User = {
    id: currentUserId,
    name: 'Jessica Chen',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    isOnline: true
  };

  const {
    localStream,
    remoteStream,
    isConnecting,
    connectionState,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    endCall,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    isSocketConnected
  } = useWebRTC({
    currentUser,
    onCallStateChange: setCallState
  });

  if (isDesktop === null) {
    return (
      <div className="flex h-full overflow-hidden bg-background">
        <div className="w-full flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    if (!isDesktop) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleRoomSelect = (room: Room) => {
    setActiveRoom(room);
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  };

  const handleCreateRoom = (room: Room) => {
    const enhancedRoom = {
      ...room,
      isEncrypted: true,
      admins: room.isGroup ? [currentUserId] : undefined,
      notificationSettings: {
        muted: false,
        soundEnabled: true,
        desktopNotifications: true
      }
    };
    
    toast({
      title: "Room created",
      description: `You've created "${room.name}" with end-to-end encryption enabled`,
    });
  };

  const handleUpdateRoom = (updatedRoom: Room) => {
    setActiveRoom(updatedRoom);
    toast({
      title: "Room updated",
      description: "Room settings have been updated",
    });
  };

  const handleUpdateRoomNotificationSettings = (roomId: string, settings: Room['notificationSettings']) => {
    if (activeRoom && activeRoom.id === roomId) {
      setActiveRoom({
        ...activeRoom,
        notificationSettings: settings
      });
    }
  };

  const handleAddScheduledMessage = (message: ScheduledMessage) => {
    setScheduledMessages(prev => [...prev, message]);
  };

  const handleDeleteScheduledMessage = (messageId: string) => {
    setScheduledMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const handleSendScheduledMessageNow = (messageId: string) => {
    const message = scheduledMessages.find(msg => msg.id === messageId);
    if (message) {
      handleDeleteScheduledMessage(messageId);
    }
  };

  const handleStartCall = async (type: 'voice' | 'video', targetUser: User, roomId?: string) => {
    if (!isSocketConnected) {
      toast({
        title: "Connection Error",
        description: "Not connected to signaling server. Please check your internet connection.",
        variant: "destructive"
      });
      return;
    }

    try {
      await startCall(type, targetUser, roomId);
      toast({
        title: `${type === 'video' ? 'Video' : 'Voice'} call started`,
        description: `Calling ${targetUser.name}...`,
      });
    } catch (error) {
      toast({
        title: "Call failed",
        description: error instanceof Error ? error.message : "Could not start the call. Please check your permissions.",
        variant: "destructive"
      });
    }
  };

  const handleAcceptCall = async () => {
    if (!callState.offerPayload) {
      toast({ title: "Hata", description: "Gelen arama bilgisi bulunamadı.", variant: "destructive" });
      return;
    }
    
    try {
      await answerCall(callState.offerPayload);
      toast({
        title: "Call accepted",
        description: "Connected to the call",
      });
    } catch (error) {
      toast({
        title: "Failed to accept call",
        description: error instanceof Error ? error.message : "Could not join the call. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeclineCall = () => {
    setCallState(prev => ({ ...prev, isActive: false, isIncoming: false, offerPayload: null }));
    toast({
      title: "Call declined",
      description: "The call has been declined",
    });
  };

  const handleEndCall = () => {
    endCall();
    toast({
      title: "Call ended",
      description: "The call has been ended",
    });
  };

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {!isConnected && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Connecting to server...</span>
          </div>
        </div>
      )}

      {connectionError && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-medium">Connection Error</div>
              <div className="text-sm opacity-90">{connectionError}</div>
            </div>
            <button 
              onClick={retryConnection}
              className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!isDesktop && (
        <MobileHeader 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          activeRoom={activeRoom}
        />
      )}
      <div 
        className={`${
          isSidebarOpen || isDesktop ? "translate-x-0" : "-translate-x-full"
        } ${
          isDesktop ? "w-80 flex-shrink-0" : "fixed z-40 h-[calc(100%-4rem)] w-80"
        } transition-transform duration-200 ease-in-out`}
      >
        <ChatSidebar 
          activeRoom={activeRoom}
          onSelectRoom={handleRoomSelect}
          onCreateRoom={handleCreateRoom}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatArea 
          activeRoom={activeRoom}
          currentUserId={currentUserId}
          globalNotificationSettings={globalNotificationSettings}
          scheduledMessages={scheduledMessages}
          callState={callState}
          onUpdateRoom={handleUpdateRoom}
          onUpdateGlobalNotificationSettings={setGlobalNotificationSettings}
          onUpdateRoomNotificationSettings={handleUpdateRoomNotificationSettings}
          onAddScheduledMessage={handleAddScheduledMessage}
          onDeleteScheduledMessage={handleDeleteScheduledMessage}
          onSendScheduledMessageNow={handleSendScheduledMessageNow}
          onStartCall={handleStartCall}
        />
      </div>

      {callState.isActive && !callState.isIncoming && (
        <CallInterface
          callState={callState}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          onEndCall={handleEndCall}
          onToggleVideo={toggleVideo}
          onToggleAudio={toggleAudio}
          onStartScreenShare={startScreenShare}
          isConnecting={isConnecting}
          connectionState={connectionState}
        />
      )}

      {callState.isIncoming && (
        <IncomingCallDialog
          callState={callState}
          onAcceptCall={handleAcceptCall}
          onDeclineCall={handleDeclineCall}
        />
      )}

      {process.env.NODE_ENV === 'development' && <DebugPanel />}
    </div>
  );
}