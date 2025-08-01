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
      title: "多參數量子可視化系統",
      audioAnalyzer: "音頻分析器",
      quantumVisualizer: "多參數量子可視化",
      spectrumAnalysis: "頻譜分析",
      waveformVisualization: "波形可視化",
      audioFeatures: "音頻特徵",
      fourierTransform: "傅立葉轉換可視化",
    },
    controls: {
      startRecording: "開始錄音",
      stopRecording: "停止錄音",
      language: "語言",
      theme: "主題",
      light: "淺色",
      dark: "深色",
    },
    features: {
      pitch: "音高",
      loudness: "響度",
      spectralCentroid: "頻譜重心",
      spectralEnergy: "頻譜能量",
      harmonicNoiseRatio: "和諧/噪音比率",
    },
    units: {
      hz: "Hz",
      db: "dB",
    },
    errors: {
      title: "錯誤：",
      microphoneAccess: "無法訪問麥克風。請確保已授予權限。",
    },
  },
  en: {
    app: {
      title: "Quantum Audio Analysis System",
      audioAnalyzer: "Quantum Audio Analyzer",
      quantumVisualizer: "Quantum Visualizer",
      spectrumAnalysis: "Spectrum Analysis",
      waveformVisualization: "Waveform Visualization",
      audioFeatures: "Audio Features",
      fourierTransform: "Fourier Transform Visualization",
    },
    controls: {
      startRecording: "Start Recording",
      stopRecording: "Stop Recording",
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
    },
    features: {
      pitch: "Pitch",
      loudness: "Loudness",
      spectralCentroid: "Spectral Centroid",
      spectralEnergy: "Spectral Energy",
      harmonicNoiseRatio: "Harmonic/Noise Ratio",
    },
    units: {
      hz: "Hz",
      db: "dB",
    },
    errors: {
      title: "Error:",
      microphoneAccess:
        "Cannot access microphone. Please ensure permission is granted.",
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
  const [theme, setTheme] = useState<Theme>("light");

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
