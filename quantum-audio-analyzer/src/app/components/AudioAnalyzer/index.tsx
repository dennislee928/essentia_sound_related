"use client";

import { useEffect, useRef, useState } from "react";
import type { Essentia } from "essentia.js";

const AudioAnalyzer = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const essentiaRef = useRef<Essentia | null>(null);

  useEffect(() => {
    const initEssentia = async () => {
      try {
        const essentiaModule = await import("essentia.js");
        // @ts-ignore
        const EssentiaWASM = await essentiaModule.EssentiaWASM();
        const essentia = new essentiaModule.Essentia(EssentiaWASM);
        essentiaRef.current = essentia;
      } catch (error) {
        console.error("Error initializing Essentia:", error);
      }
    };

    initEssentia();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const startRecording = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      analyzerRef.current = audioContextRef.current.createAnalyser();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyzerRef.current!);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  return (
    <div>
      <button onClick={startRecording}>
        {isRecording ? "停止錄音" : "開始錄音"}
      </button>
    </div>
  );
};

export default AudioAnalyzer;
