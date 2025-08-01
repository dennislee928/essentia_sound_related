"use client";

import React from 'react';
import { useApp } from '../../context/AppContext';

const ControlPanel: React.FC = () => {
  const { language, setLanguage, theme, setTheme, t } = useApp();

  return (
    <div className="theme-card p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-xl font-bold theme-text">
          {t('app.title')}
        </h2>
        
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="theme-text text-sm font-medium">
              {t('controls.language')}:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'zh' | 'en')}
              className="px-3 py-1 rounded border theme-border theme-card text-sm"
              aria-label={t('controls.language')}
            >
              <option value="zh">繁體中文</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="theme-text text-sm font-medium">
              {t('controls.theme')}:
            </label>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="px-3 py-1 rounded border theme-border theme-card hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              {theme === 'light' ? '🌙' : '☀️'} {t(`controls.${theme === 'light' ? 'dark' : 'light'}`)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
