"use client";

import { MessageSquare } from "lucide-react";

export function WelcomeScreen() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md px-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome to Modern Chat</h1>
        <p className="text-muted-foreground mb-6">
          Select a conversation from the sidebar or create a new one to get started.
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-lg p-4 border bg-card/50">
            <h3 className="font-medium mb-2">Direct Messages</h3>
            <p className="text-sm text-muted-foreground">
              Chat privately with friends and colleagues
            </p>
          </div>
          <div className="rounded-lg p-4 border bg-card/50">
            <h3 className="font-medium mb-2">Group Chats</h3>
            <p className="text-sm text-muted-foreground">
              Create groups for team discussions
            </p>
          </div>
          <div className="rounded-lg p-4 border bg-card/50">
            <h3 className="font-medium mb-2">Secure Rooms</h3>
            <p className="text-sm text-muted-foreground">
              Password-protected private rooms
            </p>
          </div>
          <div className="rounded-lg p-4 border bg-card/50">
            <h3 className="font-medium mb-2">File Sharing</h3>
            <p className="text-sm text-muted-foreground">
              Share documents and media easily
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}