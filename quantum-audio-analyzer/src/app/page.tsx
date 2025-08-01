"use client";

import dynamic from "next/dynamic";
import ControlPanel from "./components/ControlPanel";

const AudioAnalyzer = dynamic(() => import("./components/AudioAnalyzer"), {
  ssr: false,
});

const QuantumVisualizer = dynamic(
  () => import("./components/QuantumVisualizer"),
  { ssr: false }
);

export default function Home() {
  return (
    <main
      className="min-h-screen p-8"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <ControlPanel />
        <AudioAnalyzer />
        <QuantumVisualizer />
      </div>
    </main>
  );
}
