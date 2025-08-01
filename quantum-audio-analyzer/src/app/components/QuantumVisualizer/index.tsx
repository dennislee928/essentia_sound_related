"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { useApp } from "../../context/AppContext";

interface AudioFeatures {
  pitch: number;
  loudness: number;
  centroid: number;
  energy: number;
  hfc: number;
  spectrum: Float32Array;
}

interface QuantumVisualizerProps {
  audioFeatures?: AudioFeatures;
}

const QuantumVisualizer: React.FC<QuantumVisualizerProps> = ({
  audioFeatures,
}) => {
  const { t } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const curvesRef = useRef<THREE.Line[]>([]);
  const gridRef = useRef<THREE.GridHelper | null>(null);

  const initializeScene = useCallback(() => {
    if (!canvasRef.current) return;

    // 清理舊的場景
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);

    const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
    camera.position.set(10, 5, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(800, 400);
    renderer.setClearColor(0x000011);

    // 創建網格
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    scene.add(gridHelper);

    // 創建 3D 曲線（類似圖片中的曲線）
    const curves: THREE.Line[] = [];
    const colors = [0xff0000, 0x0000ff, 0x000000]; // 紅色、藍色、黑色

    for (let i = 0; i < 3; i++) {
      const points: THREE.Vector3[] = [];
      const segments = 100;

      // 創建類似圖片的衰減曲線
      for (let j = 0; j <= segments; j++) {
        const x = (j / segments) * 10 - 5;
        const baseY = Math.exp(-Math.abs(x) * 0.5); // 指數衰減
        const y = baseY * (1 + 0.3 * Math.sin(j * 0.2 + (i * Math.PI) / 3)); // 添加波動
        const z = i * 2 - 2; // 不同 z 位置

        points.push(new THREE.Vector3(x, y, z));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: colors[i],
        linewidth: 2,
      });

      const curve = new THREE.Line(geometry, material);
      scene.add(curve);
      curves.push(curve);
    }

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 保存引用
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    curvesRef.current = curves;
    gridRef.current = gridHelper;

    return { scene, camera, renderer, curves };
  }, []);

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    // 使用音頻特徵參數更新 3D 曲線
    if (audioFeatures && curvesRef.current.length > 0) {
      const { pitch, loudness, centroid, energy, hfc } = audioFeatures;

      curvesRef.current.forEach((curve, index) => {
        const geometry = curve.geometry as THREE.BufferGeometry;
        const positions = geometry.attributes.position.array as Float32Array;

        // 根據不同的音頻特徵參數調整每條曲線
        for (let i = 0; i < positions.length / 3; i++) {
          const x = positions[i * 3];
          const baseY = Math.exp(-Math.abs(x) * 0.5);

          let amplitudeFactor = 1;

          // 第一條曲線：根據音高 (pitch) 調整
          if (index === 0) {
            amplitudeFactor = 1 + (pitch / 1000) * 2; // 音高影響振幅
            const frequency = pitch / 100; // 頻率影響波形
            amplitudeFactor *=
              1 + 0.5 * Math.sin(x * frequency * 0.1 + Date.now() * 0.01);
          }
          // 第二條曲線：根據響度 (loudness) 和頻譜重心 (centroid) 調整
          else if (index === 1) {
            amplitudeFactor = 1 + (loudness / 50) * 1.5; // 響度影響整體振幅
            const centroidFactor = centroid / 2000; // 頻譜重心影響波形形狀
            amplitudeFactor *=
              1 + centroidFactor * Math.cos(x * 0.5 + Date.now() * 0.005);
          }
          // 第三條曲線：根據頻譜能量 (energy) 和和諧比率 (hfc) 調整
          else if (index === 2) {
            amplitudeFactor = 1 + (energy / 1000) * 3; // 能量影響振幅
            const hfcFactor = hfc > 0 ? hfc * 2 : 0.1; // 和諧比率影響波動
            amplitudeFactor *=
              1 + hfcFactor * Math.sin(x * 0.3 + Date.now() * 0.008);
          }

          positions[i * 3 + 1] = baseY * amplitudeFactor;
        }

        geometry.attributes.position.needsUpdate = true;
      });
    }

    // 根據音頻特徵調整相機位置
    const time = Date.now() * 0.0005;
    let cameraDistance = 15;
    let rotationSpeed = 1;

    if (audioFeatures) {
      // 響度影響相機距離
      cameraDistance = 15 + audioFeatures.loudness / 10;
      // 頻譜能量影響旋轉速度
      rotationSpeed = 1 + audioFeatures.energy / 500;
    }

    cameraRef.current.position.x =
      Math.cos(time * rotationSpeed) * cameraDistance;
    cameraRef.current.position.z =
      Math.sin(time * rotationSpeed) * cameraDistance;
    cameraRef.current.lookAt(0, 0, 0);

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    requestAnimationFrame(animate);
  }, [audioFeatures]);

  useEffect(() => {
    const sceneData = initializeScene();
    if (sceneData) {
      animate();
    }

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      curvesRef.current.forEach((curve) => {
        curve.geometry.dispose();
        (curve.material as THREE.Material).dispose();
      });
    };
  }, [initializeScene, animate]);

  return (
    <div className="theme-card p-6 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4 theme-text">
        {t("app.fourierTransform")}
      </h2>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="canvas-container rounded-lg border theme-border"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default QuantumVisualizer;
