"use client";

import { useEffect, useRef, useState } from "react";
import { MessageList } from "@/components/message-list";
import { MessageInput } from "@/components/message-input";
import { ChatHeader } from "@/components/chat-header";
import { Message, Room, NotificationSettings, ScheduledMessage, CallState, User } from "@/types/chat";
import { mockMessages } from "@/lib/mock-data";
import { WelcomeScreen } from "@/components/welcome-screen";

interface ChatAreaProps {
  activeRoom: Room | null;
  currentUserId: string;
  globalNotificationSettings: NotificationSettings;
  scheduledMessages: ScheduledMessage[];
  callState: CallState;
  onUpdateRoom: (room: Room) => void;
  onUpdateGlobalNotificationSettings: (settings: NotificationSettings) => void;
  onUpdateRoomNotificationSettings: (roomId: string, settings: Room['notificationSettings']) => void;
  onAddScheduledMessage: (message: ScheduledMessage) => void;
  onDeleteScheduledMessage: (messageId: string) => void;
  onSendScheduledMessageNow: (messageId: string) => void;
  onStartCall: (type: 'voice' | 'video', targetUser: User, roomId?: string) => void;
}

export function ChatArea({ 
  activeRoom, 
  currentUserId,
  globalNotificationSettings,
  scheduledMessages,
  callState,
  onUpdateRoom,
  onUpdateGlobalNotificationSettings,
  onUpdateRoomNotificationSettings,
  onAddScheduledMessage,
  onDeleteScheduledMessage,
  onSendScheduledMessageNow,
  onStartCall
}: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages for the active room
  useEffect(() => {
    if (activeRoom) {
      // In a real app, you'd fetch messages from a backend
      const roomMessages = mockMessages.filter(m => m.roomId === activeRoom.id);
      // Add encryption status to messages
      const encryptedMessages = roomMessages.map(msg => ({
        ...msg,
        isEncrypted: activeRoom.isEncrypted || false
      }));
      setMessages(encryptedMessages);
      
      // Simulate someone typing
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setMessages([]);
    }
  }, [activeRoom]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string, type?: 'text' | 'image' | 'file' | 'voice', audioBlob?: Blob, duration?: number) => {
    if (!activeRoom || (!content.trim() && !audioBlob)) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      roomId: activeRoom.id,
      content: type === 'voice' ? 'Voice message' : content,
      type: type || 'text',
      audioBlob: audioBlob,
      duration: duration,
      isEncrypted: activeRoom.isEncrypted || false,
      sender: {
        id: currentUserId,
        name: 'You',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
        isOnline: true
      },
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    setMessages([...messages, newMessage]);
    
    // Simulate message being delivered
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' as const } 
            : msg
        )
      );
    }, 1000);
    
    // Simulate message being read
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'read' as const } 
            : msg
        )
      );
    }, 2000);
  };

  const handleScheduleMessage = (scheduledMessage: Omit<ScheduledMessage, 'id' | 'createdAt'>) => {
    const newScheduledMessage: ScheduledMessage = {
      ...scheduledMessage,
      id: `scheduled-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    onAddScheduledMessage(newScheduledMessage);
  };

  if (!activeRoom) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        room={activeRoom} 
        currentUserId={currentUserId}
        globalNotificationSettings={globalNotificationSettings}
        scheduledMessages={scheduledMessages}
        onUpdateRoom={onUpdateRoom}
        onUpdateGlobalNotificationSettings={onUpdateGlobalNotificationSettings}
        onUpdateRoomNotificationSettings={onUpdateRoomNotificationSettings}
        onDeleteScheduledMessage={onDeleteScheduledMessage}
        onSendScheduledMessageNow={onSendScheduledMessageNow}
        onStartCall={onStartCall}
      />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <MessageList 
          messages={messages} 
          isTyping={isTyping} 
        />
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput 
        roomId={activeRoom.id}
        onSendMessage={handleSendMessage}
        onScheduleMessage={handleScheduleMessage}
        disabled={callState.isActive} // Disable input during calls
      />
    </div>
  );
}