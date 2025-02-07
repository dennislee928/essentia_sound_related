"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Essentia } from "essentia.js";

// 定義 Essentia 向量類型
type EssentiaVector = {
  size: () => number;
  get: (index: number) => number;
  set: (index: number, value: number) => void;
};

// 定義 Essentia 方法的返回類型
interface EssentiaResults {
  pitch: { pitch: number };
  loudness: { loudness: number };
  spectrum: { spectrum: EssentiaVector };
  centroid: { centroid: number };
  energy: { energy: number };
  hfc: { hfc: number };
}

// 定義 Essentia 方法的類型
interface EssentiaInterface {
  arrayToVector: (array: Float32Array) => EssentiaVector;
  vectorToArray: (vector: EssentiaVector) => Float32Array;
  PitchYinProbabilistic: (
    vector: EssentiaVector,
    config: {
      frameSize: number;
      sampleRate: number;
      minFrequency: number;
      maxFrequency: number;
    }
  ) => EssentiaResults["pitch"];
  Loudness: (vector: EssentiaVector) => EssentiaResults["loudness"];
  Spectrum: (
    vector: EssentiaVector,
    config: { size: number }
  ) => EssentiaResults["spectrum"];
  Centroid: (spectrum: EssentiaVector) => EssentiaResults["centroid"];
  Energy: (spectrum: EssentiaVector) => EssentiaResults["energy"];
  HFC: (spectrum: EssentiaVector) => EssentiaResults["hfc"];
}

const AudioAnalyzer = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const essentiaRef = useRef<Essentia | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [audioFeatures, setAudioFeatures] = useState<{
    pitch: number;
    loudness: number;
    centroid: number;
    energy: number;
    hfc: number;
    spectrum: Float32Array;
  }>({
    pitch: 0,
    loudness: 0,
    centroid: 0,
    energy: 0,
    hfc: 0,
    spectrum: new Float32Array(),
  });
  const [error, setError] = useState<string | null>(null);

  const drawSpectrum = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const { width, height } = canvas;

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);

    const spectrum = audioFeatures.spectrum;
    const barWidth = width / spectrum.length;

    ctx.beginPath();
    ctx.strokeStyle = "rgb(0, 255, 0)";
    ctx.lineWidth = 2;

    for (let i = 0; i < spectrum.length; i++) {
      const x = i * barWidth;
      const magnitude = (Math.log10(1 + spectrum[i] * 1000) * height) / 3;
      if (i === 0) {
        ctx.moveTo(x, height - magnitude);
      } else {
        ctx.lineTo(x, height - magnitude);
      }
    }
    ctx.stroke();
  }, [audioFeatures.spectrum]);

  useEffect(() => {
    const initEssentia = async () => {
      try {
        console.log("Starting Essentia initialization...");

        // 先加載 WASM 模塊
        console.log("Loading WASM module...");
        const wasmModule = await import("essentia.js/dist/essentia-wasm.web");
        console.log("WASM module imported:", wasmModule);

        console.log("Initializing WASM...");
        await wasmModule.default();
        console.log("WASM initialized successfully");

        // 然後初始化 Essentia
        console.log("Importing Essentia module...");
        const essentiaModule = await import("essentia.js");
        console.log("Essentia module imported:", essentiaModule);

        console.log("Creating Essentia instance...");
        const essentia = new essentiaModule.Essentia();
        console.log("Essentia instance created:", essentia);

        essentiaRef.current = essentia;
        console.log("Essentia initialization completed successfully");
      } catch (error) {
        console.error("Error initializing Essentia:", error);
        console.log("Error details:", {
          name: error instanceof Error ? error.name : "Unknown",
          message: error instanceof Error ? error.message : String(error),
          module:
            error instanceof Error
              ? (error as Error & { module?: unknown }).module
              : "Unknown",
          stack: error instanceof Error ? error.stack : "No stack trace",
        });
        setError("Failed to initialize audio analysis engine");
      }
    };

    initEssentia();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const stopRecording = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    setIsRecording(false);
  };

  const startRecording = async () => {
    try {
      setError(null);
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        analyzerRef.current = audioContextRef.current.createAnalyser();
        analyzerRef.current.fftSize = 4096;
        analyzerRef.current.smoothingTimeConstant = 0.8;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      setMediaStream(stream);
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyzerRef.current!);
      setIsRecording(true);
    } catch (err) {
      setError(
        "Cannot access microphone. Please ensure permission is granted."
      );
      console.error("Error accessing microphone:", err);
    }
  };

  const analyzeAudio = async () => {
    if (!analyzerRef.current || !essentiaRef.current) return;

    const analyzer = analyzerRef.current;
    const bufferLength = analyzer.frequencyBinCount;
    const timeData = new Float32Array(bufferLength);
    analyzer.getFloatTimeDomainData(timeData);

    try {
      const essentia = essentiaRef.current as unknown as EssentiaInterface;

      const vector = essentia.arrayToVector(timeData);

      const pitchResult = essentia.PitchYinProbabilistic(vector, {
        frameSize: 4096,
        sampleRate: 44100,
        minFrequency: 20,
        maxFrequency: 4000,
      });

      const loudnessResult = essentia.Loudness(vector);
      const spectrumResult = essentia.Spectrum(vector, {
        size: 4096,
      });
      const spectrum = essentia.vectorToArray(spectrumResult.spectrum);
      const centroidResult = essentia.Centroid(spectrumResult.spectrum);
      const energyResult = essentia.Energy(spectrumResult.spectrum);
      const hfcResult = essentia.HFC(spectrumResult.spectrum);

      setAudioFeatures({
        pitch: pitchResult.pitch,
        loudness: loudnessResult.loudness,
        centroid: centroidResult.centroid,
        energy: energyResult.energy,
        hfc: hfcResult.hfc,
        spectrum: spectrum,
      });
    } catch (error) {
      console.error("Error analyzing audio:", error);
    }
  };

  useEffect(() => {
    if (isRecording) {
      const intervalId = setInterval(analyzeAudio, 50);
      const animationId = requestAnimationFrame(function animate() {
        drawSpectrum();
        animationFrameRef.current = requestAnimationFrame(animate);
      });

      return () => {
        clearInterval(intervalId);
        cancelAnimationFrame(animationId);
      };
    }
  }, [isRecording, drawSpectrum]);

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      audioContextRef.current?.close();
    };
  }, [mediaStream]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded-full font-medium transition-colors ${
          isRecording
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      <div className="mt-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full border border-gray-300 rounded-lg bg-black"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Pitch:</span>
          <span className="ml-2 font-medium">
            {audioFeatures.pitch.toFixed(1)} Hz
          </span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Loudness:</span>
          <span className="ml-2 font-medium">
            {audioFeatures.loudness.toFixed(1)} dB
          </span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Spectral Centroid:</span>
          <span className="ml-2 font-medium">
            {audioFeatures.centroid.toFixed(1)} Hz
          </span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Spectral Energy:</span>
          <span className="ml-2 font-medium">
            {audioFeatures.energy.toFixed(3)}
          </span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Harmonic/Noise Ratio:</span>
          <span className="ml-2 font-medium">
            {audioFeatures.hfc.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error === "Failed to initialize audio analysis engine"
            ? "Failed to initialize audio analysis engine"
            : error ===
              "Cannot access microphone. Please ensure permission is granted."
            ? "Cannot access microphone. Please ensure permission is granted."
            : error}
        </div>
      )}
    </div>
  );
};

export default AudioAnalyzer;
