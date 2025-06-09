"use client";

interface UserStatusProps {
  status: "active" | "away" | "offline" | "busy";
}

export function UserStatus({ status }: UserStatusProps) {
  let statusText = "";
  let statusClass = "";
  
  switch (status) {
    case "active":
      statusText = "Active now";
      statusClass = "bg-green-500";
      break;
    case "away":
      statusText = "Away";
      statusClass = "bg-yellow-500";
      break;
    case "busy":
      statusText = "Do not disturb";
      statusClass = "bg-red-500";
      break;
    case "offline":
      statusText = "Offline";
      statusClass = "bg-gray-500";
      break;
  }
  
  return (
    <div className="flex items-center text-xs text-muted-foreground">
      <span className={`h-2 w-2 rounded-full mr-1.5 ${statusClass}`} />
      {statusText}
    </div>
  );
}