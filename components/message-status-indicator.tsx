"use client";

import { Check, CheckCheck, Clock, AlertCircle } from "lucide-react";

interface MessageStatusIndicatorProps {
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  timestamp: string;
}

export function MessageStatusIndicator({ status, timestamp }: MessageStatusIndicatorProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-muted-foreground animate-spin" />;
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'sending':
        return 'Sending...';
      case 'sent':
        return 'Sent';
      case 'delivered':
        return 'Delivered';
      case 'read':
        return 'Read';
      case 'failed':
        return 'Failed to send';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <span>{new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      <div className="flex items-center gap-1" title={getStatusText()}>
        {getStatusIcon()}
      </div>
    </div>
  );
}