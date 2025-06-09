"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "active" | "away" | "offline" | "busy";
}

interface ProfileSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export function ProfileSettingsDialog({ isOpen, onClose, user }: ProfileSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState<string>(user.status);
  
  // This would save to a backend in a real app
  const handleSave = () => {
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="py-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                >
                  <span className="sr-only">Change avatar</span>
                  <span className="text-xs">+</span>
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Display Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="away">Away</SelectItem>
                    <SelectItem value="busy">Do Not Disturb</SelectItem>
                    <SelectItem value="offline">Appear Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure how and when you receive notifications
              </p>
              
              <div className="grid gap-4 pt-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Direct Messages</h4>
                    <p className="text-sm text-muted-foreground">
                      Notifications for direct messages
                    </p>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Messages</SelectItem>
                      <SelectItem value="mentions">Mentions Only</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Group Chats</h4>
                    <p className="text-sm text-muted-foreground">
                      Notifications for group conversations
                    </p>
                  </div>
                  <Select defaultValue="mentions">
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select" />
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
          </TabsContent>
          
          <TabsContent value="privacy" className="py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Privacy Settings</h3>
              <p className="text-sm text-muted-foreground">
                Manage your privacy and security settings
              </p>
              
              <div className="grid gap-4 pt-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Read Receipts</h4>
                    <p className="text-sm text-muted-foreground">
                      Show when you've read messages
                    </p>
                  </div>
                  <Select defaultValue="on">
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on">On</SelectItem>
                      <SelectItem value="off">Off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Last Seen</h4>
                    <p className="text-sm text-muted-foreground">
                      Show when you were last active
                    </p>
                  </div>
                  <Select defaultValue="everyone">
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="contacts">Contacts Only</SelectItem>
                      <SelectItem value="nobody">Nobody</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}