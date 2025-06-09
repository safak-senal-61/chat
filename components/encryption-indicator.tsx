"use client";

import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EncryptionIndicatorProps {
  isEncrypted: boolean;
  className?: string;
}

export function EncryptionIndicator({ isEncrypted, className = "" }: EncryptionIndicatorProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center ${className}`}>
            {isEncrypted ? (
              <ShieldCheck className="h-4 w-4 text-green-500" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-yellow-500" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isEncrypted 
              ? "End-to-end encrypted" 
              : "Not encrypted"
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}