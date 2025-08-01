"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const AudioAnalyzer: React.FC = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spectrumCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [audioFeatures, setAudioFeatures] = useState({
    pitch: 0,
    loudness: 0,
    centroid: 0,
    energy: 0,
    hfc: 0,
    spectrum: new Float32Array(1024) as Float32Array,
  });
  const [error, setError] = useState<string | null>(null);

  const drawSpectrum = useCallback(() => {
    if (!spectrumCanvasRef.current || !audioFeatures.spectrum) return;
    const canvas = spectrumCanvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const { width, height } = canvas;

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);

    const spectrum = audioFeatures.spectrum;
    if (spectrum.length === 0) return;

    const barWidth = width / spectrum.length;

    ctx.beginPath();
    ctx.strokeStyle = "rgb(0, 255, 0)";
    ctx.lineWidth = 2;

    for (let i = 0; i < spectrum.length; i++) {
      const x = i * barWidth;
      const magnitude =
        (Math.log10(1 + Math.abs(spectrum[i]) * 1000) * height) / 4;
      if (i === 0) {
        ctx.moveTo(x, height - magnitude);
      } else {
        ctx.lineTo(x, height - magnitude);
      }
    }
    ctx.stroke();
  }, [audioFeatures.spectrum]);

  const drawWaveform = useCallback((timeData: Float32Array) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const { width, height } = canvas;

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.strokeStyle = "rgb(0, 200, 255)";
    ctx.lineWidth = 2;

    const sliceWidth = width / timeData.length;
    let x = 0;

    for (let i = 0; i < timeData.length; i++) {
      const v = (timeData[i] * height) / 2;
      const y = height / 2 + v;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();
  }, []);

  // 初始化音頻分析引擎
  useEffect(() => {
    const initAudioEngine = async () => {
      try {
        console.log("Initializing native Web Audio API...");
        // 使用原生 Web Audio API 而不是 Essentia.js
        // 這樣可以避免外部依賴的問題
        console.log("Audio engine ready");
      } catch (error) {
        console.error("Error initializing audio engine:", error);
        setError(
          "Failed to initialize audio analysis engine: " +
            (error instanceof Error ? error.message : String(error))
        );
      }
    };

    initAudioEngine();

    return () => {
      const ctx = audioContextRef.current;
      if (ctx && ctx.state !== "closed") {
        ctx.close().catch(() => {});
      }
      audioContextRef.current = null;
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
      connectAudioSource(source);
      setIsRecording(true);
    } catch (err) {
      setError(
        "Cannot access microphone. Please ensure permission is granted."
      );
      console.error("Error accessing microphone:", err);
    }
  };

  const analyzeAudio = async () => {
    if (!analyzerRef.current) return;

    const analyzer = analyzerRef.current;
    const bufferLength = analyzer.frequencyBinCount;
    const timeData = new Float32Array(bufferLength);
    const freqData = new Uint8Array(bufferLength);
    const floatFreqData = new Float32Array(bufferLength);

    analyzer.getFloatTimeDomainData(timeData);
    analyzer.getByteFrequencyData(freqData);
    analyzer.getFloatFrequencyData(floatFreqData);

    try {
      // 計算基本音頻特徵

      // 1. 響度（平均音量）
      const loudness =
        freqData.reduce((sum, value) => sum + value, 0) / freqData.length;

      // 2. 頻譜重心（亮度）
      let weightedSum = 0;
      let magnitudeSum = 0;
      for (let i = 0; i < freqData.length; i++) {
        const magnitude = freqData[i];
        weightedSum += magnitude * i;
        magnitudeSum += magnitude;
      }
      const centroid =
        magnitudeSum > 0
          ? (weightedSum / magnitudeSum) * (22050 / freqData.length)
          : 0;

      // 3. 能量
      const energy =
        freqData.reduce((sum, value) => sum + value * value, 0) /
        freqData.length;

      // 4. 簡單的基頻估算（找到最大峰值）
      let maxIndex = 0;
      let maxValue = 0;
      for (let i = 1; i < freqData.length / 4; i++) {
        if (freqData[i] > maxValue) {
          maxValue = freqData[i];
          maxIndex = i;
        }
      }
      const pitch = maxIndex * (22050 / freqData.length);

      // 5. 高頻內容（HFC）
      let hfc = 0;
      for (let i = Math.floor(freqData.length / 2); i < freqData.length; i++) {
        hfc += freqData[i] * freqData[i];
      }
      hfc = hfc / (freqData.length / 2);

      setAudioFeatures({
        pitch,
        loudness,
        centroid,
        energy,
        hfc,
        spectrum: floatFreqData,
      });

      // 繪製波形
      drawWaveform(timeData);
    } catch (error) {
      console.error("Error analyzing audio:", error);
    }
  };

  useEffect(() => {
    if (isRecording) {
      const animate = () => {
        if (isRecording) {
          analyzeAudio();
          drawSpectrum();
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animate();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isRecording, drawSpectrum]);

  // 單獨處理 AudioContext 的清理
  useEffect(() => {
    return () => {
      // 使用 setTimeout 來延遲清理，避免在 React 的清理階段執行
      setTimeout(() => {
        const ctx = audioContextRef.current;
        if (ctx && ctx.state !== "closed") {
          ctx.close().catch(() => {});
        }
        audioContextRef.current = null;
      }, 0);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioContextRef.current) return;

    // 創建分析器節點
    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 2048;
    analyzerRef.current = analyser;

    // 設置 canvas
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2;

        const hue = (i / bufferLength) * 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 連接音頻源到分析器
  const connectAudioSource = useCallback(
    (source: MediaStreamAudioSourceNode) => {
      if (analyzerRef.current) {
        source.connect(analyzerRef.current);
        analyzerRef.current.connect(audioContextRef.current!.destination);
      }
    },
    []
  );

  return (
    <div className="w-full">
      <div className="p-4 bg-white rounded-lg shadow-md items-center">
        <h2 className="text-2xl font-bold mb-4 text-center">量子音頻分析器</h2>
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
          <h3 className="text-lg font-semibold mb-3">頻譜分析</h3>
          <canvas
            ref={spectrumCanvasRef}
            width={800}
            height={200}
            className="w-full border border-gray-300 rounded-lg bg-black"
          />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">波形可視化</h3>
          <canvas
            ref={canvasRef}
            width={800}
            height={200}
            className="w-full border border-gray-300 rounded-lg bg-black"
          />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">音頻特徵</h3>
          <div className="grid grid-cols-2 gap-4">
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
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            <div className="font-bold mb-2">錯誤：</div>
            <div>{error}</div>
            <div className="mt-2 text-sm font-mono whitespace-pre-wrap">
              {JSON.stringify(
                {
                  name:
                    typeof error === "object" && error
                      ? (error as Error).name
                      : "Unknown",
                  message:
                    typeof error === "object" && error
                      ? (error as Error).message
                      : String(error),
                  stack:
                    typeof error === "object" && error
                      ? (error as Error).stack
                      : "No stack trace",
                },
                null,
                2
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioAnalyzer;
