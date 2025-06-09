"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const emojiCategories = {
  recent: ["😀", "😂", "❤️", "👍", "🎉", "🔥", "💯", "✨"],
  smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳"],
  gestures: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👋", "🤚", "🖐️", "✋", "🖖", "👏", "🙌", "🤲", "🤝", "🙏"],
  hearts: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟"],
  objects: ["🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🥈", "🥉", "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🥅", "🏒"],
  symbols: ["🔥", "💯", "✨", "⭐", "🌟", "💫", "⚡", "💥", "💢", "💨", "💦", "💤", "🕳️", "💣", "💬", "👁️‍🗨️", "🗨️", "🗯️", "💭", "💤"]
};

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState("recent");

  return (
    <div className="bg-card border rounded-lg shadow-lg p-2 w-80 h-64">
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-6 h-8">
          <TabsTrigger value="recent" className="text-xs p-1">⏰</TabsTrigger>
          <TabsTrigger value="smileys" className="text-xs p-1">😀</TabsTrigger>
          <TabsTrigger value="gestures" className="text-xs p-1">👋</TabsTrigger>
          <TabsTrigger value="hearts" className="text-xs p-1">❤️</TabsTrigger>
          <TabsTrigger value="objects" className="text-xs p-1">🎉</TabsTrigger>
          <TabsTrigger value="symbols" className="text-xs p-1">🔥</TabsTrigger>
        </TabsList>
        
        {Object.entries(emojiCategories).map(([category, emojis]) => (
          <TabsContent key={category} value={category} className="mt-2">
            <ScrollArea className="h-48">
              <div className="grid grid-cols-8 gap-1">
                {emojis.map((emoji, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-muted"
                    onClick={() => onEmojiSelect(emoji)}
                  >
                    <span className="text-lg">{emoji}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}