"use client";

import dynamic from "next/dynamic";

const AudioAnalyzer = dynamic(() => import("./components/AudioAnalyzer"), {
  ssr: false,
});

const QuantumVisualizer = dynamic(
  () => import("./components/QuantumVisualizer"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <AudioAnalyzer />
        <QuantumVisualizer />
      </div>
    </main>
  );
}
