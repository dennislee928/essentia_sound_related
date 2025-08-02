/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import ControlPanel from "./components/ControlPanel";
import { useApp } from "./context/AppContext";

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
  const { t } = useApp();

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 賽博朋克背景效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>

      {/* 浮動粒子效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 主標題區域 */}
        <div className="text-center mb-8 slide-in">
          <h1 className="cyberpunk-title text-4xl md:text-6xl mb-4">
            {t("app.title")}
          </h1>
          <p className="theme-text text-lg md:text-xl max-w-2xl mx-auto">
            {t("app.subtitle")}
          </p>
        </div>

        {/* 控制面板 */}
        <div className="mb-8 slide-in" style={{ animationDelay: "0.2s" }}>
          <ControlPanel />
        </div>

        {/* 主要內容區域 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 音頻分析器 */}
          <div
            className="lg:col-span-8 slide-in"
            style={{ animationDelay: "0.4s" }}
          >
            <AudioAnalyzer onAudioFeatures={setAudioFeatures} />
          </div>

          {/* 側邊欄 - 量子視覺化器 */}
          <div
            className="lg:col-span-4 slide-in"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="theme-card p-6 h-fit sticky top-8">
              <h3 className="cyberpunk-title text-xl mb-4">
                {t("app.quantumVisualizer")}
              </h3>
              <div className="space-y-4">
                {audioFeatures ? (
                  <QuantumVisualizer audioFeatures={audioFeatures} />
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="theme-muted">{t("app.waitingForData")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <div
          className="mt-12 text-center slide-in"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="theme-card p-6 max-w-4xl mx-auto">
            <h3 className="cyberpunk-title text-2xl mb-4">
              {t("app.technicalSpecs")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="data-card">
                <h4 className="theme-accent font-bold mb-2">
                  {t("technical.audioAnalysis")}
                </h4>
                <p className="theme-muted text-sm">
                  {t("technical.realTimeSpectrum")} • {t("technical.pitchDetection")} • {t("technical.loudnessMeasurement")}
                </p>
              </div>
              <div className="data-card">
                <h4 className="theme-accent font-bold mb-2">
                  {t("technical.quantumVisualization")}
                </h4>
                <p className="theme-muted text-sm">
                  {t("technical.quantumStateMapping")} • {t("technical.phaseSpace")} • {t("technical.entanglementEffects")}
                </p>
              </div>
              <div className="data-card">
                <h4 className="theme-accent font-bold mb-2">
                  {t("technical.responsiveDesign")}
                </h4>
                <p className="theme-muted text-sm">
                  {t("technical.multiDeviceSupport")} • {t("technical.touchOptimization")} • {t("technical.accessibilityDesign")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
