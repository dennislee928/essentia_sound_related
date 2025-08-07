# 🎵⚛️ Quantum Audio Analyzer

一個具有賽博朋克風格的量子音頻分析系統，提供實時音頻分析和量子視覺化。

[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.179.0-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ 特色功能

### 🎨 賽博朋克風格設計

- **霓虹色彩主題**: 使用青色、洋紅、綠色等賽博朋克經典色彩
- **動態背景**: 移動的網格背景和浮動粒子效果
- **霓虹發光效果**: 按鈕、標題和邊框具有發光動畫
- **Orbitron 字體**: 使用賽博朋克風格的字體

### 📱 響應式設計

- **移動設備優化**: 完美適配手機和平板電腦
- **自適應佈局**: 根據螢幕尺寸自動調整組件排列
- **觸控友好**: 優化觸控設備的交互體驗
- **彈性網格**: 使用 CSS Grid 和 Flexbox 實現靈活佈局

### 🎯 改善的用戶體驗

- **分層動畫**: 組件以錯開的時間進入畫面
- **狀態指示器**: 實時顯示系統狀態
- **懸停效果**: 豐富的互動反饋
- **錯誤處理**: 美觀的錯誤訊息顯示

## 🚀 技術特色

### 音頻分析

- **實時頻譜分析**: 使用 Web Audio API 進行實時音頻處理
- **音高檢測**: 基於 FFT 的音高識別算法
- **響度測量**: 動態範圍和音量分析
- **頻譜重心計算**: 音頻亮度和色彩分析
- **能量分析**: 音頻能量密度計算
- **諧波噪聲比**: 音質評估指標

### 量子視覺化

- **Three.js 3D 渲染**: 高性能 WebGL 視覺化
- **動態波形線條**: 8 層次傅立葉轉換效果
- **粒子系統**: 多層次量子態粒子雲
- **能量環**: 旋轉的霓虹能量環
- **全息投影效果**: 環繞式全息平面
- **響應式畫布**: 自適應容器大小

### 響應式佈局

- **桌面端**: 12 列網格佈局，側邊欄固定
- **平板端**: 自適應列數，組件重新排列
- **手機端**: 單列垂直佈局，組件堆疊
- **側邊欄**: 桌面端固定，移動端堆疊

## 🎮 使用方法

### 1. 啟動應用

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置生產版本
npm run build

# 啟動生產版本
npm start
```

### 2. 使用步驟

1. **授權麥克風**: 點擊錄音按鈕並允許麥克風權限
2. **開始分析**: 點擊"開始錄音"按鈕
3. **查看結果**: 觀察實時音頻特徵和量子視覺化
4. **切換語言**: 使用語言選擇器切換中英文
5. **主題切換**: 使用主題按鈕切換深淺色主題

## 📱 響應式斷點

| 設備類型   | 螢幕寬度     | 佈局特點                 |
| ---------- | ------------ | ------------------------ |
| **桌面端** | ≥1024px      | 12 列網格，側邊欄固定    |
| **平板端** | 768px-1023px | 自適應列數，組件重新排列 |
| **手機端** | <768px       | 單列垂直，組件堆疊       |

## 🎨 設計系統

### 色彩主題

- **主色**: 青色 (#00d4ff) - 霓虹藍
- **輔色**: 洋紅 (#ff006e) - 霓虹粉
- **背景**: 深色漸變 - 賽博朋克氛圍
- **文字**: 高對比度 - 確保可讀性

### 動畫效果

- **進入動畫**: slideIn - 組件滑入效果
- **懸停效果**: 發光和縮放 - 互動反饋
- **背景動畫**: 網格移動 - 動態背景
- **粒子效果**: 浮動動畫 - 氛圍營造

## 🌐 國際化支援

### 支援語言

- **繁體中文**: 完整的中文介面
- **English**: 完整的英文介面

### 翻譯功能

- **動態切換**: 即時語言切換
- **本地化存儲**: 記住用戶語言偏好
- **完整覆蓋**: 所有 UI 元素都有翻譯
- **格式化工具**: 數字和單位格式化

## 📦 技術架構

### 前端框架

- **Next.js 15**: React 全棧框架
- **TypeScript**: 類型安全的 JavaScript
- **Tailwind CSS**: 實用優先的 CSS 框架

### 3D 視覺化

- **Three.js**: WebGL 3D 渲染引擎
- **Web Audio API**: 原生音頻處理
- **Canvas API**: 2D 圖形渲染

### 狀態管理

- **React Context**: 全局狀態管理
- **Local Storage**: 用戶偏好持久化
- **Custom Hooks**: 可重用的邏輯封裝

## 🔧 開發指南

### 專案結構

```
quantum-audio-analyzer/
├── src/
│   ├── app/
│   │   ├── components/          # React組件
│   │   │   ├── AudioAnalyzer/   # 音頻分析器
│   │   │   ├── ControlPanel/    # 控制面板
│   │   │   ├── QuantumVisualizer/ # 量子視覺化
│   │   │   └── Footer/          # 頁腳組件
│   │   ├── context/             # React Context
│   │   ├── hooks/               # 自定義Hooks
│   │   ├── types/               # TypeScript類型
│   │   └── globals.css          # 全局樣式
│   └── locales/                 # 國際化文件
├── public/                      # 靜態資源
└── package.json                 # 依賴配置
```

### 主要依賴

```json
{
  "next": "15.1.6",
  "react": "^19.1.1",
  "three": "^0.179.0",
  "tailwindcss": "^3.4.1",
  "typescript": "^5"
}
```

## 🎯 核心功能

### 音頻分析引擎

```typescript
// 實時音頻特徵提取
interface AudioFeatures {
  pitch: number; // 音高 (Hz)
  loudness: number; // 響度 (dB)
  centroid: number; // 頻譜重心 (Hz)
  energy: number; // 能量密度
  hfc: number; // 諧波噪聲比
  spectrum: Float32Array; // 頻譜數據
}
```

### 量子視覺化系統

```typescript
// 3D視覺化組件
- 動態波形線條 (8層次)
- 粒子系統 (4個層次)
- 能量環 (8個旋轉環)
- 全息投影平面 (6個平面)
- 霓虹網格地板
```

## 🚀 部署

### Vercel 部署

```bash
# 安裝Vercel CLI
npm i -g vercel

# 部署到Vercel
vercel

# 生產部署
vercel --prod
```

### 環境變數

```env
# 開發環境
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 生產環境
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🤝 貢獻指南

### 開發流程

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 代碼規範

- 使用 TypeScript 進行類型檢查
- 遵循 ESLint 規則
- 使用 Prettier 格式化代碼
- 編寫單元測試

## 📄 授權

本專案採用 MIT 授權條款 - 查看 [LICENSE](LICENSE) 文件了解詳情。

## 👨‍💻 作者

**Dennis Lee** - [pcleegood@gmail.com](mailto:pcleegood@gmail.com)

### 聯絡資訊

- 🌐 [個人網站](https://www.dennisleehappy.org/)
- 🔬 [ORCID](https://orcid.org/0009-0008-8937-3810)
- 💼 [LinkedIn](https://linkedin.com/in/pf-frog-4a3a352a2)
- 🎨 [作品集](https://next-js-portfolio-pi-ten.vercel.app/)
- 📅 [預約會議](https://calendly.com/pcleegood)
- 💧 [Web3 Faucet](https://web3.dennisleehappy.org/faucet)

## 🙏 致謝

- [Next.js](https://nextjs.org/) - React 全棧框架
- [Three.js](https://threejs.org/) - 3D 視覺化引擎
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - 音頻處理

---

**享受探索音頻的量子維度！** 🎵⚛️

> _"在量子世界中，每個音符都是一個波函數，每個頻率都是一個本徵態。"_
