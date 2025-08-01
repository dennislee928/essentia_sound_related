"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import ControlPanel from "./components/ControlPanel";

interface AudioFeatures {
  pitch: number;
  loudness: number;
  centroid: number;
  energy: number;
  hfc: number;
  spectrum: Float32Array;
}

const AudioAnalyzer = dynamic(() => import("./components/AudioAnalyzer"), {
  ssr: false,
});

const QuantumVisualizer = dynamic(
  () => import("./components/QuantumVisualizer"),
  { ssr: false }
);

export default function Home() {
  const [audioFeatures, setAudioFeatures] = useState<
    AudioFeatures | undefined
  >();

  return (
    <main
      className="min-h-screen p-8 text-center"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <ControlPanel />

        <AudioAnalyzer onAudioFeatures={setAudioFeatures} />
      </div>
    </main>
  );
}
