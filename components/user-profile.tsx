"use client";

import { useState } from "react";
import { Settings, LogOut, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserStatus } from "@/components/user-status";
import { ProfileSettingsDialog } from "@/components/profile-settings-dialog";
import { useTheme } from "next-themes";

export function UserProfile() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // In a real app, get this from auth/state
  const user = {
    id: "current-user",
    name: "Jessica Chen",
    email: "jessica@example.com",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    status: "active" as const
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="p-4 border-t mt-auto flex items-center justify-between">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium truncate">{user.name}</div>
          <UserStatus status={user.status} />
        </div>
      </div>
      
      <div className="flex space-x-1">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      
      <ProfileSettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
      />
    </div>
  );
}