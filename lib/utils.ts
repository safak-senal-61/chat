import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { Message } from "@/types/chat";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(isoString: string): string {
  return format(new Date(isoString), "HH:mm");
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return format(date, "MMMM d, yyyy");
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  
  if (isToday(date)) {
    return format(date, "HH:mm");
  }
  
  if (isYesterday(date)) {
    return "Yesterday";
  }
  
  if (date.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) {
    return format(date, "EEEE"); // Day name
  }
  
  return format(date, "dd/MM/yyyy");
}

export function groupMessagesByDate(messages: Message[]): Record<string, Message[]> {
  return messages.reduce((groups, message) => {
    const date = new Date(message.timestamp);
    
    let dateString;
    if (isToday(date)) {
      dateString = "Today";
    } else if (isYesterday(date)) {
      dateString = "Yesterday";
    } else {
      dateString = format(date, "MMMM d, yyyy");
    }
    
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    
    groups[dateString].push(message);
    return groups;
  }, {} as Record<string, Message[]>);
}