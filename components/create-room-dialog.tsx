"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Room } from "@/types/chat";

interface CreateRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (room: Room) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Room name must be at least 2 characters.",
  }),
  isGroup: z.boolean().default(false),
  isPasswordProtected: z.boolean().default(false),
  password: z.string().optional(),
}).refine(data => {
  // If password protection is enabled, password is required
  if (data.isPasswordProtected && (!data.password || data.password.length < 4)) {
    return false;
  }
  return true;
}, {
  message: "Password must be at least 4 characters",
  path: ["password"],
});

type FormData = z.infer<typeof formSchema>;

export function CreateRoomDialog({ isOpen, onClose, onCreateRoom }: CreateRoomDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      isGroup: false,
      isPasswordProtected: false,
      password: "",
    },
  });
  
  const isPasswordProtected = form.watch("isPasswordProtected");
  const isGroup = form.watch("isGroup");

  function onSubmit(data: FormData) {
    const newRoom: Room = {
      id: "",  // will be set by the parent
      name: data.name,
      avatar: isGroup 
        ? "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg"
        : "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      lastMessage: "Room created",
      lastActivity: new Date().toISOString(),
      unreadCount: 0,
      isGroup: data.isGroup,
      isPasswordProtected: data.isPasswordProtected,
      password: data.password,
      participants: isGroup ? [
        {
          id: "user-1",
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
      ] : [
        {
          id: "user-1",
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
      createdAt: new Date().toISOString()
    };
    
    onCreateRoom(newRoom);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
          <DialogDescription>
            Create a new conversation or group chat. Groups allow multiple participants.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isGroup"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Group Chat
                      </div>
                    </FormLabel>
                    <FormDescription>
                      Create a chat with multiple participants
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isPasswordProtected"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      <div className="flex items-center">
                        <Lock className="mr-2 h-4 w-4" />
                        Password Protection
                      </div>
                    </FormLabel>
                    <FormDescription>
                      Restrict access with a password
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {isPasswordProtected && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}