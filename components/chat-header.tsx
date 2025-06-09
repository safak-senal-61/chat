"use client";

import { useState } from "react";
import { MoreVertical, Users, Lock, Info, Shield, Bell, Clock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Room, User } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoomInfoDialog } from "@/components/room-info-dialog";
import { GroupManagementDialog } from "@/components/group-management-dialog";
import { NotificationSettingsDialog } from "@/components/notification-settings-dialog";
import { ScheduledMessagesDialog } from "@/components/scheduled-messages-dialog";
import { EncryptionIndicator } from "@/components/encryption-indicator";
import { CallControls } from "@/components/call-controls";
import { NotificationSettings, ScheduledMessage } from "@/types/chat";

interface ChatHeaderProps {
  room: Room;
  currentUserId: string;
  globalNotificationSettings: NotificationSettings;
  scheduledMessages: ScheduledMessage[];
  onUpdateRoom: (room: Room) => void;
  onUpdateGlobalNotificationSettings: (settings: NotificationSettings) => void;
  onUpdateRoomNotificationSettings: (roomId: string, settings: Room['notificationSettings']) => void;
  onDeleteScheduledMessage: (messageId: string) => void;
  onSendScheduledMessageNow: (messageId: string) => void;
  onStartCall: (type: 'voice' | 'video', targetUser: User, roomId?: string) => void;
}

export function ChatHeader({ 
  room, 
  currentUserId,
  globalNotificationSettings,
  scheduledMessages,
  onUpdateRoom,
  onUpdateGlobalNotificationSettings,
  onUpdateRoomNotificationSettings,
  onDeleteScheduledMessage,
  onSendScheduledMessageNow,
  onStartCall
}: ChatHeaderProps) {
  const [isRoomInfoOpen, setIsRoomInfoOpen] = useState(false);
  const [isGroupManagementOpen, setIsGroupManagementOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isScheduledMessagesOpen, setIsScheduledMessagesOpen] = useState(false);

  const isCurrentUserAdmin = room.admins?.includes(currentUserId) || false;
  const roomScheduledMessages = scheduledMessages.filter(msg => msg.roomId === room.id);
  
  // Get the other participant for 1-on-1 calls
  const otherParticipant = room.isGroup ? null : room.participants?.find(p => p.id !== currentUserId);

  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={room.avatar} />
          <AvatarFallback>{room.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">{room.name}</h2>
            {room.isPasswordProtected && (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
            {room.isGroup && (
              <Users className="h-4 w-4 text-muted-foreground" />
            )}
            <EncryptionIndicator isEncrypted={room.isEncrypted || false} />
            {room.notificationSettings?.muted && (
              <Bell className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {room.isGroup 
              ? `${room.participants?.length || 0} members` 
              : room.participants?.some(p => p.isOnline) 
                ? "Online"
                : "Offline"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        {/* Call Controls for 1-on-1 chats */}
        {!room.isGroup && otherParticipant && (
          <CallControls
            targetUser={otherParticipant}
            roomId={room.id}
            onStartCall={onStartCall}
          />
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsRoomInfoOpen(true)}
        >
          <Info className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsNotificationSettingsOpen(true)}>
              <Bell className="h-4 w-4 mr-2" />
              Notification settings
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => setIsScheduledMessagesOpen(true)}>
              <Clock className="h-4 w-4 mr-2" />
              Scheduled messages
              {roomScheduledMessages.length > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {roomScheduledMessages.length}
                </span>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuItem>Search in conversation</DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {room.isGroup && isCurrentUserAdmin && (
              <DropdownMenuItem onClick={() => setIsGroupManagementOpen(true)}>
                <Shield className="h-4 w-4 mr-2" />
                Manage group
              </DropdownMenuItem>
            )}
            
            {room.isGroup && (
              <DropdownMenuItem>
                <UserPlus className="h-4 w-4 mr-2" />
                Add members
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="text-destructive">
              {room.isGroup ? "Leave group" : "Delete chat"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <RoomInfoDialog
        isOpen={isRoomInfoOpen}
        onClose={() => setIsRoomInfoOpen(false)}
        room={room}
      />
      
      {room.isGroup && (
        <GroupManagementDialog
          isOpen={isGroupManagementOpen}
          onClose={() => setIsGroupManagementOpen(false)}
          room={room}
          currentUserId={currentUserId}
          onUpdateRoom={onUpdateRoom}
        />
      )}
      
      <NotificationSettingsDialog
        isOpen={isNotificationSettingsOpen}
        onClose={() => setIsNotificationSettingsOpen(false)}
        room={room}
        globalSettings={globalNotificationSettings}
        onUpdateGlobalSettings={onUpdateGlobalNotificationSettings}
        onUpdateRoomSettings={onUpdateRoomNotificationSettings}
      />
      
      <ScheduledMessagesDialog
        isOpen={isScheduledMessagesOpen}
        onClose={() => setIsScheduledMessagesOpen(false)}
        scheduledMessages={roomScheduledMessages}
        onDeleteScheduledMessage={onDeleteScheduledMessage}
        onSendNow={onSendScheduledMessageNow}
      />
    </div>
  );
}