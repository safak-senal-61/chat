"use client";

export function TypingIndicator() {
  return (
    <div className="inline-flex items-center bg-muted rounded-xl px-4 py-2">
      <div className="flex space-x-1">
        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
      </div>
      <span className="ml-3 text-xs text-muted-foreground">Someone is typing...</span>
    </div>
  );
}