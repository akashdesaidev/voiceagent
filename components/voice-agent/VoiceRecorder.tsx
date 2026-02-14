"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  maxDuration?: number; // in seconds
}

export function VoiceRecorder({
  onRecordingComplete,
  maxDuration = 180,
}: VoiceRecorderProps) {
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [status, setStatus] = useState<"idle" | "recording" | "stopped">("idle");
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string>("");

  // Only run on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setMediaBlobUrl(url);
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setStatus("recording");
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Unable to access microphone. Please grant permission.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setStatus("stopped");
    }
  };
  
  const clearBlobUrl = () => {
    if (mediaBlobUrl) {
      URL.revokeObjectURL(mediaBlobUrl);
      setMediaBlobUrl("");
    }
    setStatus("idle");
  };
  
  // Timer logic
  useEffect(() => {
    if (status === "recording") {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (status === "idle") {
        setRecordingTime(0);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, maxDuration, stopRecording]);
  
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleClear = () => {
    clearBlobUrl();
    setRecordingTime(0);
    setIsPlaying(false);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Don't render until mounted on client
  if (!isMounted) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">🎙️ Record Your Voice</h3>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">🎙️ Record Your Voice</h3>
          <p className="text-sm text-muted-foreground">
            Max duration: {maxDuration}s
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-4 w-full">
          {status === "idle" && !mediaBlobUrl && (
            <Button
              size="lg"
              className="rounded-full w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={startRecording}
            >
              <Mic className="w-6 h-6" />
            </Button>
          )}
          
          {status === "recording" && (
            <div className="flex flex-col items-center gap-3">
              <div className="text-3xl font-mono font-bold text-red-600 animate-pulse">
                {formatTime(recordingTime)}
              </div>
              <Button
                size="lg"
                variant="destructive"
                className="rounded-full w-16 h-16"
                onClick={stopRecording}
              >
                <Square className="w-6 h-6 fill-current" />
              </Button>
            </div>
          )}
          
          {status === "stopped" && mediaBlobUrl && (
            <div className="w-full flex flex-col gap-3">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </Button>
              </div>
              <audio
                ref={audioRef}
                src={mediaBlobUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              <div className="text-center text-sm text-muted-foreground">
                Recording: {formatTime(recordingTime)}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
