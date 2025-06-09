"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Crown, Shield, UserMinus, UserPlus, Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Room, User } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";

interface GroupManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  currentUserId: string;
  onUpdateRoom: (room: Room) => void;
}

const addMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type AddMemberFormData = z.infer<typeof addMemberSchema>;

export function GroupManagementDialog({ 
  isOpen, 
  onClose, 
  room, 
  currentUserId,
  onUpdateRoom 
}: GroupManagementDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("members");
  const { toast } = useToast();
  
  const form = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: "",
    },
  });

  const isCurrentUserAdmin = room.admins?.includes(currentUserId) || false;
  
  const filteredParticipants = room.participants?.filter(participant =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handlePromoteToAdmin = (userId: string) => {
    if (!isCurrentUserAdmin) return;
    
    const updatedRoom = {
      ...room,
      admins: [...(room.admins || []), userId],
      participants: room.participants?.map(p => 
        p.id === userId ? { ...p, role: 'admin' as const } : p
      )
    };
    
    onUpdateRoom(updatedRoom);
    toast({
      title: "Member promoted",
      description: "User has been promoted to admin",
    });
  };

  const handleDemoteFromAdmin = (userId: string) => {
    if (!isCurrentUserAdmin || userId === currentUserId) return;
    
    const updatedRoom = {
      ...room,
      admins: room.admins?.filter(id => id !== userId) || [],
      participants: room.participants?.map(p => 
        p.id === userId ? { ...p, role: 'member' as const } : p
      )
    };
    
    onUpdateRoom(updatedRoom);
    toast({
      title: "Admin demoted",
      description: "User has been demoted to member",
    });
  };

  const handleRemoveMember = (userId: string) => {
    if (!isCurrentUserAdmin || userId === currentUserId) return;
    
    const updatedRoom = {
      ...room,
      participants: room.participants?.filter(p => p.id !== userId) || [],
      admins: room.admins?.filter(id => id !== userId) || []
    };
    
    onUpdateRoom(updatedRoom);
    toast({
      title: "Member removed",
      description: "User has been removed from the group",
    });
  };

  const handleAddMember = (data: AddMemberFormData) => {
    // In a real app, you'd search for the user by email and add them
    const newMember: User = {
      id: `user-${Date.now()}`,
      name: data.email.split('@')[0],
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
      isOnline: false,
      role: 'member'
    };

    const updatedRoom = {
      ...room,
      participants: [...(room.participants || []), newMember]
    };
    
    onUpdateRoom(updatedRoom);
    form.reset();
    toast({
      title: "Member added",
      description: `${newMember.name} has been added to the group`,
    });
  };

  const getRoleIcon = (user: User) => {
    if (room.admins?.includes(user.id)) {
      return <Crown className="h-4 w-4 text-yellow-500" />;
    }
    return null;
  };

  const getRoleBadge = (user: User) => {
    if (room.admins?.includes(user.id)) {
      return <Badge variant="secondary\" className="text-xs">Admin</Badge>;
    }
    return <Badge variant="outline" className="text-xs">Member</Badge>;
  };

  if (!room.isGroup) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Group Management
          </DialogTitle>
          <DialogDescription>
            Manage members, roles, and group settings for {room.name}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">Members ({room.participants?.length || 0})</TabsTrigger>
            <TabsTrigger value="add">Add Members</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {filteredParticipants.map(participant => (
                  <div 
                    key={participant.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name[0]}</AvatarFallback>
                        </Avatar>
                        {participant.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{participant.name}</span>
                          {getRoleIcon(participant)}
                          {participant.id === currentUserId && (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getRoleBadge(participant)}
                          <span className="text-xs text-muted-foreground">
                            {participant.isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isCurrentUserAdmin && participant.id !== currentUserId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!room.admins?.includes(participant.id) ? (
                            <DropdownMenuItem onClick={() => handlePromoteToAdmin(participant.id)}>
                              <Crown className="h-4 w-4 mr-2" />
                              Promote to Admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleDemoteFromAdmin(participant.id)}>
                              <Shield className="h-4 w-4 mr-2" />
                              Demote from Admin
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleRemoveMember(participant.id)}
                          >
                            <UserMinus className="h-4 w-4 mr-2" />
                            Remove from Group
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            {isCurrentUserAdmin ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddMember)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Add Member by Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Only group admins can add new members
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}