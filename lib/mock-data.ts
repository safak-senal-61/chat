import { Room, Message } from "@/types/chat";

// Mock data for rooms
export const mockRooms: Room[] = [
  {
    id: "room-1",
    name: "Marketing Team",
    avatar: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
    lastMessage: "Meeting scheduled for tomorrow at 10 AM",
    lastActivity: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    unreadCount: 2,
    isGroup: true,
    isPasswordProtected: false,
    isEncrypted: true,
    admins: ["current-user", "user-2"],
    notificationSettings: {
      muted: false,
      soundEnabled: true,
      desktopNotifications: true
    },
    participants: [
      {
        id: "current-user",
        name: "You",
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
        isOnline: true,
        role: "admin"
      },
      {
        id: "user-2",
        name: "Alex Johnson",
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        isOnline: true,
        role: "admin"
      },
      {
        id: "user-3",
        name: "Sarah Parker",
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
        isOnline: false,
        role: "member"
      }
    ],
    createdAt: "2023-06-15T09:00:00Z"
  },
  {
    id: "room-2",
    name: "Sarah Parker",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    lastMessage: "Looking forward to our call!",
    lastActivity: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    unreadCount: 0,
    isGroup: false,
    isPasswordProtected: false,
    isEncrypted: true,
    notificationSettings: {
      muted: false,
      soundEnabled: true,
      desktopNotifications: true
    },
    participants: [
      {
        id: "current-user",
        name: "You",
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
        isOnline: true
      },
      {
        id: "user-3",
        name: "Sarah Parker",
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
        isOnline: true
      }
    ],
    createdAt: "2023-07-20T14:30:00Z"
  },
  {
    id: "room-3",
    name: "Project X",
    avatar: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg",
    lastMessage: "I've uploaded the latest design files",
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    unreadCount: 5,
    isGroup: true,
    isPasswordProtected: true,
    isEncrypted: true,
    password: "secret123",
    admins: ["current-user"],
    notificationSettings: {
      muted: true,
      muteUntil: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
      soundEnabled: false,
      desktopNotifications: false
    },
    participants: [
      {
        id: "current-user",
        name: "You",
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
        isOnline: true,
        role: "admin"
      },
      {
        id: "user-2",
        name: "Alex Johnson",
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        isOnline: false,
        role: "member"
      },
      {
        id: "user-4",
        name: "Michael Brown",
        avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
        isOnline: true,
        role: "member"
      }
    ],
    createdAt: "2023-05-10T11:20:00Z"
  },
  {
    id: "room-4",
    name: "Alex Johnson",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    lastMessage: "Can you review the document?",
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    unreadCount: 0,
    isGroup: false,
    isPasswordProtected: false,
    isEncrypted: true,
    notificationSettings: {
      muted: false,
      soundEnabled: true,
      desktopNotifications: true
    },
    participants: [
      {
        id: "current-user",
        name: "You",
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
        isOnline: true
      },
      {
        id: "user-2",
        name: "Alex Johnson",
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        isOnline: false
      }
    ],
    createdAt: "2023-06-05T16:45:00Z"
  },
  {
    id: "room-5",
    name: "Design Team",
    avatar: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
    lastMessage: "New brand assets are ready",
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    unreadCount: 1,
    isGroup: true,
    isPasswordProtected: false,
    isEncrypted: false, // Not encrypted
    admins: ["user-3"],
    notificationSettings: {
      muted: false,
      soundEnabled: true,
      desktopNotifications: true
    },
    participants: [
      {
        id: "current-user",
        name: "You",
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
        isOnline: true,
        role: "member"
      },
      {
        id: "user-3",
        name: "Sarah Parker",
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
        isOnline: false,
        role: "admin"
      },
      {
        id: "user-5",
        name: "Emily Wilson",
        avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
        isOnline: false,
        role: "member"
      }
    ],
    createdAt: "2023-04-18T09:30:00Z"
  }
];

// Mock data for messages
export const mockMessages: Message[] = [
  {
    id: "msg-1",
    roomId: "room-1",
    content: "Hi everyone! I wanted to let you know that we have a marketing meeting scheduled for tomorrow at 10 AM.",
    type: "text",
    isEncrypted: true,
    sender: {
      id: "user-2",
      name: "Alex Johnson",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      isOnline: true
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "read"
  },
  {
    id: "msg-2",
    roomId: "room-1",
    content: "Thanks for the heads up! Will it be in the usual conference room?",
    type: "text",
    isEncrypted: true,
    sender: {
      id: "current-user",
      name: "You",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      isOnline: true
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    status: "read"
  },
  {
    id: "msg-3",
    roomId: "room-1",
    content: "Yes, same room as always. Don't forget to bring your latest campaign reports!",
    type: "text",
    isEncrypted: true,
    sender: {
      id: "user-2",
      name: "Alex Johnson",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      isOnline: true
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    status: "read"
  },
  {
    id: "msg-4",
    roomId: "room-1",
    content: "I've prepared some new ideas for the social media campaign. Looking forward to discussing them tomorrow.",
    type: "text",
    isEncrypted: true,
    sender: {
      id: "user-3",
      name: "Sarah Parker",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      isOnline: false
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    status: "read"
  },
  {
    id: "msg-5",
    roomId: "room-1",
    content: "Meeting scheduled for tomorrow at 10 AM. Calendar invites have been sent.",
    type: "text",
    isEncrypted: true,
    sender: {
      id: "user-2",
      name: "Alex Johnson",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      isOnline: true
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    status: "read"
  },
  // Room 2 Messages
  {
    id: "msg-6",
    roomId: "room-2",
    content: "Hi Jessica, are we still on for our call this afternoon?",
    type: "text",
    isEncrypted: true,
    sender: {
      id: "user-3",
      name: "Sarah Parker",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      isOnline: true
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    status: "read"
  },
  {
    id: "msg-7",
    roomId: "room-2",
    content: "Yes, absolutely! I've been preparing the project updates.",
    type: "text",
    isEncrypted: true,
    sender: {
      id: "current-user",
      name: "You",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      isOnline: true
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    status: "read"
  },
  {
    id: "msg-8",
    roomId: "room-2",
    content: "Great! I'm looking forward to it. I have some feedback from the client as well.",
    type: "text",
    isEncrypted: true,
    sender: {
      id: "user-3",
      name: "Sarah Parker",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      isOnline: true
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    status: "read"
  },
  {
    id: "msg-9",
    roomId: "room-2",
    content: "Perfect, that's exactly what I wanted to discuss.",
    type: "text",
    isEncrypted: true,
    sender: {
      id: "current-user",
      name: "You",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      isOnline: true
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: "read"
  },
  {
    id: "msg-10",
    roomId: "room-2",
    content: "Looking forward to our call!",
    type: "text",
    isEncrypted: true,
    sender: {
      id: "user-3",
      name: "Sarah Parker",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      isOnline: true
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "read"
  },
  // Room 3 Messages
  {
    id: "msg-11",
    roomId: "room-3",
    content: "Team, I've just uploaded the latest design files to the shared folder.",
    type: "text",
    isEncrypted: true,
    sender: {
      id: "user-4",
      name: "Michael Brown",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      isOnline: true
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    status: "read"
  },
  {
    id: "msg-12",
    roomId: "room-3",
    content: "Thanks Michael! I'll take a look right away.",
    type: "text",
    isEncrypted: true,
    sender: {
      id: "current-user",
      name: "You",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      isOnline: true
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.8).toISOString(),
    status: "read"
  }
];