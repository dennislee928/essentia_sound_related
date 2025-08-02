"use client";

import React from "react";
import { useApp } from "../../context/AppContext";

const Footer: React.FC = () => {
  const { t } = useApp();

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Email",
      url: "mailto:pcleegood@gmail.com",
      icon: "📧",
      label: "pcleegood@gmail.com",
    },
    {
      name: "Personal Website",
      url: "https://www.dennisleehappy.org/",
      icon: "🌐",
      label: "dennisleehappy.org",
    },
    {
      name: "ORCID",
      url: "https://orcid.org/0009-0008-8937-3810",
      icon: "🔬",
      label: "ORCID Profile",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/pf-frog-4a3a352a2",
      icon: "💼",
      label: "LinkedIn Profile",
    },
    {
      name: "Portfolio",
      url: "https://next-js-portfolio-pi-ten.vercel.app/",
      icon: "🎨",
      label: "Portfolio",
    },
    {
      name: "Calendly",
      url: "https://calendly.com/pcleegood",
      icon: "📅",
      label: "Schedule Meeting",
    },
    {
      name: "Web3 Faucet",
      url: "https://web3.dennisleehappy.org/faucet",
      icon: "💧",
      label: "Web3 Faucet",
    },
  ];

  return (
    <footer
      className="relative mt-16 border-t border-cyan-400/30 bg-gradient-to-t from-black/50 to-transparent slide-in"
      style={{ animationDelay: "1s" }}
    >
      {/* 背景效果 */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 via-transparent to-transparent"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 主要內容區域 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* 專案資訊 */}
          <div className="space-y-4">
            <h3 className="cyberpunk-title text-lg">{t("app.title")}</h3>
            <p className="theme-muted text-sm leading-relaxed">
              {t("footer.projectDescription")}
            </p>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>

          {/* 技術特色 */}
          <div className="space-y-4">
            <h4 className="theme-accent font-bold text-sm uppercase tracking-wider">
              {t("footer.technicalFeatures")}
            </h4>
            <ul className="space-y-2 text-sm theme-muted">
              <li>• {t("technical.realTimeSpectrum")}</li>
              <li>• {t("technical.quantumStateMapping")}</li>
              <li>• {t("technical.responsiveDesign")}</li>
              <li>• {t("technical.phaseSpace")}</li>
            </ul>
          </div>

          {/* 聯絡資訊 */}
          <div className="space-y-4">
            <h4 className="theme-accent font-bold text-sm uppercase tracking-wider">
              {t("footer.contactInfo")}
            </h4>
            <div className="space-y-2">
              <a
                href="mailto:pcleegood@gmail.com"
                className="flex items-center gap-2 text-sm theme-muted hover:text-cyan-400 transition-colors duration-300"
              >
                <span>📧</span>
                <span>pcleegood@gmail.com</span>
              </a>
              <a
                href="https://www.dennisleehappy.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm theme-muted hover:text-cyan-400 transition-colors duration-300"
              >
                <span>🌐</span>
                <span>dennisleehappy.org</span>
              </a>
            </div>
          </div>

          {/* 社交連結 */}
          <div className="space-y-4">
            <h4 className="theme-accent font-bold text-sm uppercase tracking-wider">
              {t("footer.professionalLinks")}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {socialLinks.slice(2, 6).map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs theme-muted hover:text-cyan-400 transition-colors duration-300 p-2 rounded border border-transparent hover:border-cyan-400/30"
                  title={link.name}
                >
                  <span>{link.icon}</span>
                  <span className="truncate">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 分隔線 */}
        <div className="mt-8 pt-6 border-t border-cyan-400/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* 版權資訊 */}
            <div className="text-sm theme-muted">
              © {currentYear} Dennis Lee. {t("footer.allRightsReserved")}.
            </div>

            {/* 快速連結 */}
            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href="https://calendly.com/pcleegood"
                target="_blank"
                rel="noopener noreferrer"
                className="theme-muted hover:text-cyan-400 transition-colors duration-300"
              >
                📅 {t("footer.scheduleMeeting")}
              </a>
              <a
                href="https://web3.dennisleehappy.org/faucet"
                target="_blank"
                rel="noopener noreferrer"
                className="theme-muted hover:text-cyan-400 transition-colors duration-300"
              >
                💧 {t("footer.web3Faucet")}
              </a>
              <a
                href="https://orcid.org/0009-0008-8937-3810"
                target="_blank"
                rel="noopener noreferrer"
                className="theme-muted hover:text-cyan-400 transition-colors duration-300"
              >
                🔬 {t("footer.orcid")}
              </a>
            </div>
          </div>
        </div>

        {/* 底部裝飾 */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${2 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
