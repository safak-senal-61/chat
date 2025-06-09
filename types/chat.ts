export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  role?: 'admin' | 'moderator' | 'member';
  lastSeen?: string;
}

export interface Room {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastActivity: string;
  unreadCount: number;
  isGroup: boolean;
  isPasswordProtected: boolean;
  password?: string;
  participants?: User[];
  createdAt: string;
  admins?: string[]; // User IDs who are admins
  isEncrypted?: boolean;
  notificationSettings?: {
    muted: boolean;
    muteUntil?: string;
    soundEnabled: boolean;
    desktopNotifications: boolean;
  };
}

export interface Message {
  id: string;
  roomId: string;
  content: string;
  type?: 'text' | 'image' | 'file' | 'voice';
  audioBlob?: Blob;
  duration?: number;
  sender: User;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  isEncrypted?: boolean;
  scheduledFor?: string; // ISO string for scheduled messages
  isScheduled?: boolean;
  replyTo?: {
    id: string;
    content: string;
    sender: User;
  };
}

export interface NotificationSettings {
  directMessages: 'all' | 'mentions' | 'none';
  groupChats: 'all' | 'mentions' | 'none';
  soundEnabled: boolean;
  desktopNotifications: boolean;
  emailNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
}

export interface ScheduledMessage {
  id: string;
  roomId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice';
  scheduledFor: string;
  createdAt: string;
  sender: User;
}

// New types for calling feature
export interface CallState {
  isActive: boolean;
  type: 'voice' | 'video';
  participants: User[];
  startTime?: string;
  isIncoming?: boolean;
  caller?: User;
  roomId?: string;
}

export interface CallSettings {
  videoEnabled: boolean;
  audioEnabled: boolean;
  screenSharing: boolean;
}