"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record";

interface MicrophoneWaveformProps {
  isActive?: boolean;
}

export function MicrophoneWaveform({ isActive = true }: MicrophoneWaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const recordRef = useRef<RecordPlugin | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!containerRef.current || !isActive) return;

    // Initialize WaveSurfer
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "rgb(34, 197, 94)", // green-500
      progressColor: "rgb(22, 163, 74)", // green-600
      cursorColor: "transparent",
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      height: 60,
      normalize: true,
      interact: false,
    });

    wavesurferRef.current = wavesurfer;

    // Initialize Record plugin
    const record = wavesurfer.registerPlugin(RecordPlugin.create({
      scrollingWaveform: true,
      renderRecordedAudio: false,
    }));

    recordRef.current = record;

    // Start recording from microphone
    const startRecording = async () => {
      try {
        await record.startRecording();
        setIsRecording(true);
      } catch (err) {
        console.error("Error starting recording:", err);
        setError("Could not access microphone. Please grant microphone permissions.");
      }
    };

    startRecording();

    // Cleanup
    return () => {
      if (record.isRecording()) {
        record.stopRecording();
      }
      wavesurfer.destroy();
    };
  }, [isActive]);

  return (
    <div className="relative w-full">
      {error && (
        <div className="mb-2 text-xs text-red-500">
          {error}
        </div>
      )}
      <div 
        ref={containerRef} 
        className="w-full overflow-hidden rounded-lg bg-green-50/50 dark:bg-green-950/30"
        style={{ minHeight: "60px" }}
      />
      {isRecording && (
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">Live Audio</span>
        </div>
      )}
    </div>
  );
}
