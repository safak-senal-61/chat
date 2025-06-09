"use client";

import { useState } from "react";
import { Clock, Trash2, Edit, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScheduledMessage } from "@/types/chat";
import { formatDate, formatTime } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ScheduledMessagesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  scheduledMessages: ScheduledMessage[];
  onDeleteScheduledMessage: (messageId: string) => void;
  onSendNow: (messageId: string) => void;
}

export function ScheduledMessagesDialog({
  isOpen,
  onClose,
  scheduledMessages,
  onDeleteScheduledMessage,
  onSendNow
}: ScheduledMessagesDialogProps) {
  const { toast } = useToast();

  const handleSendNow = (message: ScheduledMessage) => {
    onSendNow(message.id);
    toast({
      title: "Message sent",
      description: "Scheduled message has been sent immediately",
    });
  };

  const handleDelete = (messageId: string) => {
    onDeleteScheduledMessage(messageId);
    toast({
      title: "Message deleted",
      description: "Scheduled message has been cancelled",
    });
  };

  const getTimeUntilSend = (scheduledFor: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledFor);
    const diff = scheduled.getTime() - now.getTime();
    
    if (diff <= 0) return "Overdue";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    return `in ${minutes}m`;
  };

  const sortedMessages = [...scheduledMessages].sort((a, b) => 
    new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Scheduled Messages ({scheduledMessages.length})
          </DialogTitle>
          <DialogDescription>
            Manage your scheduled messages
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px]">
          {sortedMessages.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No scheduled messages</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedMessages.map((message) => (
                <div 
                  key={message.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">
                        {message.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {formatDate(message.scheduledFor)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {formatTime(message.scheduledFor)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {getTimeUntilSend(message.scheduledFor)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleSendNow(message)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete scheduled message?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The scheduled message will be permanently deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(message.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}