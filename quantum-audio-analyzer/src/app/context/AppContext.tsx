"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "zh" | "en";
export type Theme = "light" | "dark";

const translations = {
  zh: {
    app: {
      title: "量子音頻分析系統",
      subtitle: "探索音頻的量子維度 • 解碼聲音的未來",
      audioAnalyzer: "音頻分析器",
      quantumVisualizer: "量子視覺化器",
      spectrumAnalysis: "頻譜分析",
      waveformVisualization: "波形視覺化",
      audioFeatures: "音頻特徵",
      fourierTransform: "傅立葉轉換視覺化",
      controlCenter: "量子音頻分析控制中心",
      technicalSpecs: "技術規格",
      waitingForData: "等待音頻數據...",
    },
    controls: {
      startRecording: "開始錄音",
      stopRecording: "停止錄音",
      language: "語言",
      theme: "主題",
      light: "淺色",
      dark: "深色",
      recording: "錄音中",
      standby: "待命",
    },
    features: {
      pitch: "音高",
      loudness: "響度",
      spectralCentroid: "頻譜重心",
      spectralEnergy: "頻譜能量",
      harmonicNoiseRatio: "諧波噪聲比",
      status: "狀態",
    },
    units: {
      hz: "Hz",
      db: "dB",
      percent: "%",
    },
    status: {
      systemReady: "系統就緒",
      quantumEngineRunning: "量子引擎運行中",
      audioProcessorStandby: "音頻處理器待命",
    },
    quantum: {
      quantumState: "量子態",
      excitedState: "激發態",
      groundState: "基態",
      entanglement: "糾纏度",
    },
    technical: {
      audioAnalysis: "音頻分析",
      quantumVisualization: "量子視覺化",
      responsiveDesign: "響應式設計",
      realTimeSpectrum: "實時頻譜分析",
      pitchDetection: "音高檢測",
      loudnessMeasurement: "響度測量",
      quantumStateMapping: "量子態映射",
      phaseSpace: "相位空間",
      entanglementEffects: "糾纏效應",
      multiDeviceSupport: "多設備支援",
      touchOptimization: "觸控優化",
      accessibilityDesign: "無障礙設計",
    },
    errors: {
      title: "錯誤",
      microphoneAccess: "無法訪問麥克風。請確保已授予權限。",
      audioEngineInit: "音頻分析引擎初始化失敗",
      permissionDenied: "麥克風權限被拒絕",
      deviceNotFound: "未找到音頻設備",
      networkError: "網路連接錯誤",
      unknownError: "未知錯誤",
    },
    accessibility: {
      languageSelector: "語言選擇器",
      themeToggle: "主題切換",
      recordingButton: "錄音按鈕",
      audioVisualizer: "音頻視覺化",
      quantumVisualizer: "量子視覺化",
      spectrumAnalyzer: "頻譜分析器",
      waveformDisplay: "波形顯示",
      featureDisplay: "特徵顯示",
    },
    navigation: {
      mainContent: "主要內容",
      sidebar: "側邊欄",
      footer: "頁腳",
    },
  },
  en: {
    app: {
      title: "Quantum Audio Analysis System",
      subtitle: "Explore the Quantum Dimensions of Audio • Decode the Future of Sound",
      audioAnalyzer: "Audio Analyzer",
      quantumVisualizer: "Quantum Visualizer",
      spectrumAnalysis: "Spectrum Analysis",
      waveformVisualization: "Waveform Visualization",
      audioFeatures: "Audio Features",
      fourierTransform: "Fourier Transform Visualization",
      controlCenter: "Quantum Audio Analysis Control Center",
      technicalSpecs: "Technical Specifications",
      waitingForData: "Waiting for audio data...",
    },
    controls: {
      startRecording: "Start Recording",
      stopRecording: "Stop Recording",
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      recording: "Recording",
      standby: "Standby",
    },
    features: {
      pitch: "Pitch",
      loudness: "Loudness",
      spectralCentroid: "Spectral Centroid",
      spectralEnergy: "Spectral Energy",
      harmonicNoiseRatio: "Harmonic/Noise Ratio",
      status: "Status",
    },
    units: {
      hz: "Hz",
      db: "dB",
      percent: "%",
    },
    status: {
      systemReady: "System Ready",
      quantumEngineRunning: "Quantum Engine Running",
      audioProcessorStandby: "Audio Processor Standby",
    },
    quantum: {
      quantumState: "Quantum State",
      excitedState: "Excited State",
      groundState: "Ground State",
      entanglement: "Entanglement",
    },
    technical: {
      audioAnalysis: "Audio Analysis",
      quantumVisualization: "Quantum Visualization",
      responsiveDesign: "Responsive Design",
      realTimeSpectrum: "Real-time Spectrum Analysis",
      pitchDetection: "Pitch Detection",
      loudnessMeasurement: "Loudness Measurement",
      quantumStateMapping: "Quantum State Mapping",
      phaseSpace: "Phase Space",
      entanglementEffects: "Entanglement Effects",
      multiDeviceSupport: "Multi-device Support",
      touchOptimization: "Touch Optimization",
      accessibilityDesign: "Accessibility Design",
    },
    errors: {
      title: "Error",
      microphoneAccess: "Cannot access microphone. Please ensure permission is granted.",
      audioEngineInit: "Failed to initialize audio analysis engine",
      permissionDenied: "Microphone permission denied",
      deviceNotFound: "Audio device not found",
      networkError: "Network connection error",
      unknownError: "Unknown error occurred",
    },
    accessibility: {
      languageSelector: "Language selector",
      themeToggle: "Theme toggle",
      recordingButton: "Recording button",
      audioVisualizer: "Audio visualizer",
      quantumVisualizer: "Quantum visualizer",
      spectrumAnalyzer: "Spectrum analyzer",
      waveformDisplay: "Waveform display",
      featureDisplay: "Feature display",
    },
    navigation: {
      mainContent: "Main content",
      sidebar: "Sidebar",
      footer: "Footer",
    },
  },
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language") as Language;
      const savedTheme = localStorage.getItem("theme") as Theme;

      if (savedLang && ["zh", "en"].includes(savedLang)) {
        setLanguage(savedLang);
      }

      if (savedTheme && ["light", "dark"].includes(savedTheme)) {
        setTheme(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language);
    }
  }, [language]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  const t = (key: string): string => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
