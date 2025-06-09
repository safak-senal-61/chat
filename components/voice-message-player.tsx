"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VoiceMessagePlayerProps {
  audioBlob: Blob;
  duration?: number;
  isOwn?: boolean;
}

export function VoiceMessagePlayer({ audioBlob, duration = 0, isOwn = false }: VoiceMessagePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Create audio URL from blob
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioBlob]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setTotalDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `voice-message-${Date.now()}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl max-w-xs ${
      isOwn 
        ? 'bg-primary text-primary-foreground' 
        : 'bg-secondary text-secondary-foreground'
    }`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 rounded-full flex-shrink-0 ${
          isOwn 
            ? 'hover:bg-primary-foreground/20 text-primary-foreground' 
            : 'hover:bg-secondary-foreground/20'
        }`}
        onClick={togglePlayPause}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1">
            <Slider
              value={[currentTime]}
              max={totalDuration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs opacity-70">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 rounded-full flex-shrink-0 ${
          isOwn 
            ? 'hover:bg-primary-foreground/20 text-primary-foreground' 
            : 'hover:bg-secondary-foreground/20'
        }`}
        onClick={downloadAudio}
      >
        <Download className="h-3 w-3" />
      </Button>
    </div>
  );
}