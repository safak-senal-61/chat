"use client";

import { useState } from "react";
import { Bell, BellOff, Volume2, VolumeX, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationSettings, Room } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  room?: Room; // If provided, shows room-specific settings
  globalSettings: NotificationSettings;
  onUpdateGlobalSettings: (settings: NotificationSettings) => void;
  onUpdateRoomSettings?: (roomId: string, settings: Room['notificationSettings']) => void;
}

export function NotificationSettingsDialog({
  isOpen,
  onClose,
  room,
  globalSettings,
  onUpdateGlobalSettings,
  onUpdateRoomSettings
}: NotificationSettingsDialogProps) {
  const [settings, setSettings] = useState<NotificationSettings>(globalSettings);
  const [roomSettings, setRoomSettings] = useState(room?.notificationSettings || {
    muted: false,
    soundEnabled: true,
    desktopNotifications: true
  });
  const { toast } = useToast();

  const handleGlobalSettingsChange = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdateGlobalSettings(newSettings);
  };

  const handleQuietHoursChange = (key: 'enabled' | 'start' | 'end', value: any) => {
    const newQuietHours = { ...settings.quietHours, [key]: value };
    const newSettings = { ...settings, quietHours: newQuietHours };
    setSettings(newSettings);
    onUpdateGlobalSettings(newSettings);
  };

  const handleRoomSettingsChange = (key: keyof typeof roomSettings, value: any) => {
    const newRoomSettings = { ...roomSettings, [key]: value };
    setRoomSettings(newRoomSettings);
    
    if (room && onUpdateRoomSettings) {
      onUpdateRoomSettings(room.id, newRoomSettings);
    }
  };

  const muteRoom = (duration: string) => {
    let muteUntil: string | undefined;
    
    switch (duration) {
      case '1h':
        muteUntil = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        break;
      case '8h':
        muteUntil = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
        break;
      case '24h':
        muteUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        break;
      case 'forever':
        muteUntil = undefined;
        break;
    }

    const newRoomSettings = { 
      ...roomSettings, 
      muted: true,
      muteUntil 
    };
    setRoomSettings(newRoomSettings);
    
    if (room && onUpdateRoomSettings) {
      onUpdateRoomSettings(room.id, newRoomSettings);
    }

    toast({
      title: "Notifications muted",
      description: duration === 'forever' 
        ? "Notifications muted indefinitely" 
        : `Notifications muted for ${duration}`,
    });
  };

  const unmuteRoom = () => {
    const newRoomSettings = { 
      ...roomSettings, 
      muted: false,
      muteUntil: undefined 
    };
    setRoomSettings(newRoomSettings);
    
    if (room && onUpdateRoomSettings) {
      onUpdateRoomSettings(room.id, newRoomSettings);
    }

    toast({
      title: "Notifications unmuted",
      description: "You will now receive notifications",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </DialogTitle>
          <DialogDescription>
            {room 
              ? `Manage notifications for ${room.name}`
              : "Manage your global notification preferences"
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={room ? "room" : "global"}>
          <TabsList className="grid w-full grid-cols-2">
            {room && <TabsTrigger value="room">This Chat</TabsTrigger>}
            <TabsTrigger value="global">Global Settings</TabsTrigger>
          </TabsList>

          {room && (
            <TabsContent value="room" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Mute Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Stop receiving notifications from this chat
                    </p>
                  </div>
                  <Switch
                    checked={roomSettings.muted}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // Show mute options
                      } else {
                        unmuteRoom();
                      }
                    }}
                  />
                </div>

                {!roomSettings.muted && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => muteRoom('1h')}>
                      <Clock className="h-4 w-4 mr-2" />
                      1 Hour
                    </Button>
                    <Button variant="outline" onClick={() => muteRoom('8h')}>
                      <Clock className="h-4 w-4 mr-2" />
                      8 Hours
                    </Button>
                    <Button variant="outline" onClick={() => muteRoom('24h')}>
                      <Clock className="h-4 w-4 mr-2" />
                      1 Day
                    </Button>
                    <Button variant="outline" onClick={() => muteRoom('forever')}>
                      <BellOff className="h-4 w-4 mr-2" />
                      Forever
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Sound</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sound for new messages
                    </p>
                  </div>
                  <Switch
                    checked={roomSettings.soundEnabled}
                    onCheckedChange={(checked) => 
                      handleRoomSettingsChange('soundEnabled', checked)
                    }
                    disabled={roomSettings.muted}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Desktop Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show desktop notifications
                    </p>
                  </div>
                  <Switch
                    checked={roomSettings.desktopNotifications}
                    onCheckedChange={(checked) => 
                      handleRoomSettingsChange('desktopNotifications', checked)
                    }
                    disabled={roomSettings.muted}
                  />
                </div>
              </div>
            </TabsContent>
          )}

          <TabsContent value="global" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base mb-3 block">Message Notifications</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="direct-messages">Direct Messages</Label>
                    <Select
                      value={settings.directMessages}
                      onValueChange={(value: 'all' | 'mentions' | 'none') =>
                        handleGlobalSettingsChange('directMessages', value)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Messages</SelectItem>
                        <SelectItem value="mentions">Mentions Only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="group-chats">Group Chats</Label>
                    <Select
                      value={settings.groupChats}
                      onValueChange={(value: 'all' | 'mentions' | 'none') =>
                        handleGlobalSettingsChange('groupChats', value)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Messages</SelectItem>
                        <SelectItem value="mentions">Mentions Only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base">Notification Types</Label>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <Label>Sound Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => 
                      handleGlobalSettingsChange('soundEnabled', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <Label>Desktop Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.desktopNotifications}
                    onCheckedChange={(checked) => 
                      handleGlobalSettingsChange('desktopNotifications', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label>Email Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => 
                      handleGlobalSettingsChange('emailNotifications', checked)
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base">Quiet Hours</Label>
                
                <div className="flex items-center justify-between">
                  <Label>Enable Quiet Hours</Label>
                  <Switch
                    checked={settings.quietHours.enabled}
                    onCheckedChange={(checked) => 
                      handleQuietHoursChange('enabled', checked)
                    }
                  />
                </div>

                {settings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Start Time</Label>
                      <Select
                        value={settings.quietHours.start}
                        onValueChange={(value) => handleQuietHoursChange('start', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                              {`${i.toString().padStart(2, '0')}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-sm">End Time</Label>
                      <Select
                        value={settings.quietHours.end}
                        onValueChange={(value) => handleQuietHoursChange('end', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                              {`${i.toString().padStart(2, '0')}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}