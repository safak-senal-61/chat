"use client";

import { useState } from "react";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatArea } from "@/components/chat-area";
import { MobileHeader } from "@/components/mobile-header";
import { CallInterface } from "@/components/call-interface";
import { Room, NotificationSettings, ScheduledMessage, CallState, User } from "@/types/chat";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";
import { useAgora } from "@/hooks/useAgora";

export function Chat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    type: 'voice',
    participants: [],
  });

  const [globalNotificationSettings, setGlobalNotificationSettings] = useState<NotificationSettings>({
    directMessages: 'all',
    groupChats: 'mentions',
    soundEnabled: true,
    desktopNotifications: true,
    emailNotifications: false,
    quietHours: { enabled: false, start: '22:00', end: '08:00' }
  });
  
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { toast } = useToast();
  
  const [currentUser] = useState<User>({
    id: `user_${Math.random().toString(36).substring(2, 9)}`,
    name: 'Jessica Chen',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    isOnline: true
  });

  // useAgora'dan tüm gerekli fonksiyonları ve referansları alıyoruz
  const {
    joinChannel,
    leaveChannel,
    localVideoRef,
    remoteVideoContainerRef,
    toggleAudio,
    toggleVideo,
    startScreenShare,
  } = useAgora({
    currentUser,
    onCallStateChange: setCallState
  });

  if (isDesktop === null) {
    return (
      <div className="flex h-full overflow-hidden bg-background">
        <div className="w-full flex items-center justify-center"><div className="animate-pulse">Loading...</div></div>
      </div>
    );
  }

  const toggleSidebar = () => { if (!isDesktop) setIsSidebarOpen(!isSidebarOpen); };
  const handleRoomSelect = (room: Room) => { setActiveRoom(room); if (!isDesktop) setIsSidebarOpen(false); };
  const handleCreateRoom = (room: Room) => { toast({ title: "Room created", description: `You've created "${room.name}"` }); };

  const handleStartCall = (type: 'voice' | 'video', targetUser: User) => {
    const channelName = [currentUser.id, targetUser.id].sort().join('-');
    joinChannel(channelName, type, targetUser);
  };

  const handleEndCall = () => {
    leaveChannel();
  };

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {!isDesktop && <MobileHeader isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeRoom={activeRoom} />}
      <div 
        className={`${ isSidebarOpen || isDesktop ? "translate-x-0" : "-translate-x-full"} ${ isDesktop ? "w-80 flex-shrink-0" : "fixed z-40 h-[calc(100%-4rem)] w-80"} transition-transform duration-200 ease-in-out`}
      >
        <ChatSidebar activeRoom={activeRoom} onSelectRoom={handleRoomSelect} onCreateRoom={handleCreateRoom} />
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatArea 
          activeRoom={activeRoom}
          currentUserId={currentUser.id}
          onStartCall={handleStartCall}
          // Diğer proplarınız
          globalNotificationSettings={globalNotificationSettings}
          scheduledMessages={scheduledMessages}
          callState={callState}
          onUpdateRoom={(room) => setActiveRoom(room)}
          onUpdateGlobalNotificationSettings={setGlobalNotificationSettings}
          onUpdateRoomNotificationSettings={() => {}}
          onAddScheduledMessage={(msg) => setScheduledMessages(p => [...p, msg])}
          onDeleteScheduledMessage={(id) => setScheduledMessages(p => p.filter(m => m.id !== id))}
          onSendScheduledMessageNow={() => {}}
        />
      </div>

      {/* CallInterface'e tüm zorunlu propları eksiksiz olarak iletiyoruz */}
      {callState.isActive && (
        <CallInterface
          callState={callState}
          localVideoRef={localVideoRef}
          remoteVideoContainerRef={remoteVideoContainerRef}
          onEndCall={handleEndCall}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onStartScreenShare={startScreenShare}
        />
      )}
    </div>
  );
}