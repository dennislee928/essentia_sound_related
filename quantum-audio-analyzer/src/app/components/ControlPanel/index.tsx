"use client";

import React from "react";
import { useApp } from "../../context/AppContext";

const ControlPanel: React.FC = () => {
  const { language, setLanguage, theme, setTheme, t } = useApp();

  return (
    <div className="theme-card p-6">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        {/* 標題區域 */}
        <div className="text-center lg:text-left">
          <h2 className="cyberpunk-title text-2xl lg:text-3xl mb-2">
            {t("app.title")}
          </h2>
          <p className="theme-muted text-sm">量子音頻分析控制中心</p>
        </div>

        {/* 控制按鈕區域 */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* 語言選擇器 */}
          <div className="flex items-center gap-3">
            <label className="theme-text text-sm font-medium whitespace-nowrap">
              {t("controls.language")}:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "zh" | "en")}
              className="cyberpunk-btn px-4 py-2 text-sm bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300"
              aria-label={t("controls.language")}
            >
              <option value="zh" className="bg-gray-900 text-cyan-400">
                繁體中文
              </option>
              <option value="en" className="bg-gray-900 text-cyan-400">
                English
              </option>
            </select>
          </div>

          {/* 主題切換器 */}
          <div className="flex items-center gap-3">
            <label className="theme-text text-sm font-medium whitespace-nowrap">
              {t("controls.theme")}:
            </label>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="cyberpunk-btn px-4 py-2 text-sm flex items-center gap-2 hover:scale-105 transition-transform duration-200"
            >
              <span className="text-lg">{theme === "light" ? "🌙" : "☀️"}</span>
              <span className="hidden sm:inline">
                {t(`controls.${theme === "light" ? "dark" : "light"}`)}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 狀態指示器 */}
      <div className="mt-6 pt-6 border-t border-cyan-400/30">
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="theme-text text-sm">系統就緒</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="theme-text text-sm">量子引擎運行中</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="theme-text text-sm">音頻處理器待命</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
