/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // 處理 essentia.js 的相依性問題
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        module: false,
        util: false,
      };
    }

    // 添加 WebAssembly 支持
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    // 添加 wasm 文件加載器
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    return config;
  },

  // 添加安全配置
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
