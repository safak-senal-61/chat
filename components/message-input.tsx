"use client";

import { useState, useRef } from "react";
import { Send, Paperclip, Smile, Mic, Image, FileText, MapPin, User, Camera, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { EmojiPicker } from "@/components/emoji-picker";
import { VoiceRecorder } from "@/components/voice-recorder";
import { ScheduleMessageDialog } from "@/components/schedule-message-dialog";
import { ScheduledMessage } from "@/types/chat";

interface MessageInputProps {
  roomId: string;
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file' | 'voice', audioBlob?: Blob, duration?: number) => void;
  onScheduleMessage: (message: Omit<ScheduledMessage, 'id' | 'createdAt'>) => void;
  disabled?: boolean;
}

export function MessageInput({ roomId, onSendMessage, onScheduleMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
      
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleFileUpload = (type: 'image' | 'file') => {
    if (type === 'image') {
      imageInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (file && !disabled) {
      // In a real app, you'd upload the file and send the URL
      onSendMessage(`Shared ${type}: ${file.name}`, type);
    }
  };

  const handleVoiceRecord = (audioBlob: Blob, duration: number) => {
    if (!disabled) {
      onSendMessage("", 'voice', audioBlob, duration);
    }
    setIsRecording(false);
  };

  const handleScheduleMessage = () => {
    if (message.trim()) {
      setIsScheduleDialogOpen(true);
    }
  };

  const handleScheduleSubmit = (scheduledMessage: Omit<ScheduledMessage, 'id' | 'createdAt'>) => {
    // Use the current message content for scheduling
    const messageToSchedule = {
      ...scheduledMessage,
      content: message.trim() || scheduledMessage.content
    };
    
    onScheduleMessage(messageToSchedule);
    setMessage("");
    setIsScheduleDialogOpen(false);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  if (disabled) {
    return (
      <div className="p-4 border-t bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-4xl mx-auto">
          <div className="bg-muted/50 rounded-2xl p-4 text-center text-muted-foreground">
            Message input is disabled during calls
          </div>
        </div>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-4 border-t bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60"
    >
      <div className="max-w-4xl mx-auto">
        {/* Message Input Container with all icons inside */}
        <div className="relative flex items-end bg-muted/50 rounded-2xl">
          {/* Attachment Button - Left side */}
          <div className="absolute left-2 bottom-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  type="button"
                  className="h-8 w-8 rounded-full hover:bg-muted"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem 
                  className="gap-2 cursor-pointer"
                  onClick={() => handleFileUpload('image')}
                >
                  <Image className="h-4 w-4" />
                  Photo & Video
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="gap-2 cursor-pointer"
                  onClick={() => handleFileUpload('file')}
                >
                  <FileText className="h-4 w-4" />
                  Document
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Camera className="h-4 w-4" />
                  Camera
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <MapPin className="h-4 w-4" />
                  Location
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  Contact
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="gap-2 cursor-pointer"
                  onClick={handleScheduleMessage}
                  disabled={!message.trim()}
                >
                  <Clock className="h-4 w-4" />
                  Schedule Message
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Type a message..."
            className="resize-none min-h-[44px] max-h-[150px] border-0 bg-transparent pl-12 pr-20 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
          />
          
          {/* Right side icons */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-muted"
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-4 w-4" />
              </Button>
              {showEmojiPicker && (
                <div className="absolute bottom-10 right-0 z-50">
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                </div>
              )}
            </div>
            
            {!message.trim() ? (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  type="button"
                  className={`h-8 w-8 rounded-full hover:bg-muted ${isRecording ? 'bg-red-500 text-white' : ''}`}
                  onClick={() => setIsRecording(!isRecording)}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                {isRecording && (
                  <div className="absolute bottom-10 right-0 z-50">
                    <VoiceRecorder 
                      onRecordingComplete={handleVoiceRecord}
                      onCancel={() => setIsRecording(false)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <Button 
                size="icon" 
                type="submit"
                className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'image')}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'file')}
      />

      <ScheduleMessageDialog
        isOpen={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
        roomId={roomId}
        onScheduleMessage={handleScheduleSubmit}
      />
    </form>
  );
}