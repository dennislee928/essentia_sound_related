"use client";

import React, { useEffect, useRef, useCallback } from "react";
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
  const animationIdRef = useRef<number | null>(null);

  // Cyberpunk 視覺元素引用
  const waveformLinesRef = useRef<THREE.Line[]>([]);
  const particleSystemsRef = useRef<THREE.Points[]>([]);
  const energyRingsRef = useRef<THREE.Mesh[]>([]);
  const hologramPlanesRef = useRef<THREE.Mesh[]>([]);

  const initializeScene = useCallback(() => {
    if (!canvasRef.current) return;

    // 清理舊場景
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // 純黑背景
    scene.fog = new THREE.Fog(0x000000, 10, 100); // 添加霧效

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const aspectRatio = rect.width / rect.height;

    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(0, 20, 50);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setClearColor(0x000000);

    // === CYBERPUNK 視覺元素 ===

    // 1. 動態波形線條 (8條線，不同顏色和層次)
    const waveformLines: THREE.Line[] = [];
    const waveformColors = [
      0x00ffff, // 青色
      0xff00ff, // 洋紅
      0x00ff00, // 綠色
      0xffff00, // 黃色
      0xff0080, // 粉紅
      0x8000ff, // 紫色
      0xff4000, // 橙色
      0x40ff80, // 青綠色
    ];

    for (let layer = 0; layer < 8; layer++) {
      const points: THREE.Vector3[] = [];
      const segments = 200;

      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * 80 - 40; // 更寬的範圍
        const y = Math.sin(i * 0.1 + layer * 0.5) * 3; // 基礎波形
        const z = layer * 4 - 14; // 不同深度
        points.push(new THREE.Vector3(x, y, z));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: waveformColors[layer],
        transparent: true,
        opacity: 0.8,
        linewidth: 3,
      });

      const line = new THREE.Line(geometry, material);
      scene.add(line);
      waveformLines.push(line);
    }

    // 2. 粒子系統 (多個層次的粒子雲)
    const particleSystems: THREE.Points[] = [];

    for (let system = 0; system < 4; system++) {
      const particleCount = 1500 + system * 500;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        // 隨機分布在橢球體內
        const radius = 25 + system * 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = Math.random() * radius;

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5; // 壓扁
        positions[i * 3 + 2] = r * Math.cos(phi);

        // Cyberpunk 顏色漸變
        const colorChoice = Math.random();
        if (colorChoice < 0.25) {
          colors[i * 3] = 0;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 1; // 青色
        } else if (colorChoice < 0.5) {
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0;
          colors[i * 3 + 2] = 1; // 洋紅
        } else if (colorChoice < 0.75) {
          colors[i * 3] = 0;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 0; // 綠色
        } else {
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 0; // 黃色
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.08 + system * 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particleSystems.push(particles);
    }

    // 3. 能量環 (更多旋轉的霓虹環)
    const energyRings: THREE.Mesh[] = [];

    for (let ring = 0; ring < 8; ring++) {
      const geometry = new THREE.TorusGeometry(6 + ring * 2.5, 0.3, 8, 32);
      const material = new THREE.MeshBasicMaterial({
        color: ring % 3 === 0 ? 0x00ffff : ring % 3 === 1 ? 0xff00ff : 0x00ff00,
        transparent: true,
        opacity: 0.5,
        wireframe: true,
      });

      const torus = new THREE.Mesh(geometry, material);
      torus.rotation.x = Math.PI / 2 + (ring * Math.PI) / 16;
      torus.position.y = ring * 1.5 - 6;
      scene.add(torus);
      energyRings.push(torus);
    }

    // 4. 全息投影平面 (四面環繞)
    const hologramPlanes: THREE.Mesh[] = [];

    for (let plane = 0; plane < 6; plane++) {
      const geometry = new THREE.PlaneGeometry(25, 18);
      const material = new THREE.MeshBasicMaterial({
        color: plane % 2 === 0 ? 0x00ff80 : 0x8000ff,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        wireframe: true,
      });

      const planeMesh = new THREE.Mesh(geometry, material);
      planeMesh.position.set(
        Math.cos((plane * Math.PI) / 3) * 30,
        Math.sin(plane * 0.5) * 5,
        Math.sin((plane * Math.PI) / 3) * 30
      );
      planeMesh.lookAt(0, 0, 0);
      scene.add(planeMesh);
      hologramPlanes.push(planeMesh);
    }

    // 5. 霓虹網格地板
    const gridGeometry = new THREE.PlaneGeometry(120, 120, 60, 60);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -20;
    scene.add(grid);

    // 保存引用
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    waveformLinesRef.current = waveformLines;
    particleSystemsRef.current = particleSystems;
    energyRingsRef.current = energyRings;
    hologramPlanesRef.current = hologramPlanes;

    return { scene, camera, renderer };
  }, []);

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const time = Date.now() * 0.001;

    // 使用音頻特徵參數進行動態更新
    if (audioFeatures) {
      const { pitch, loudness, centroid, energy, hfc } = audioFeatures;

      // 更新8條波形線條 (傅立葉轉換效果)
      waveformLinesRef.current.forEach((line, index) => {
        const geometry = line.geometry as THREE.BufferGeometry;
        const positions = geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < positions.length / 3; i++) {
          const x = positions[i * 3];

          // 根據音頻特徵計算複雜的波形
          let amplitude = 1;

          // 每條線根據不同的音頻特徵響應
          switch (index % 4) {
            case 0: // 音高響應
              amplitude +=
                (pitch / 1500) * Math.sin(x * 0.08 + time * 3 + index);
              amplitude += (loudness / 40) * Math.cos(x * 0.12 + time * 2);
              break;
            case 1: // 響度響應
              amplitude +=
                (loudness / 25) * Math.sin(x * 0.1 + time * 2.5 + index * 0.7);
              amplitude += (energy / 800) * Math.sin(x * 0.15 + time * 1.8);
              break;
            case 2: // 頻譜重心響應
              amplitude +=
                (centroid / 3000) *
                Math.cos(x * 0.06 + time * 1.5 + index * 0.5);
              amplitude += hfc * 10 * Math.sin(x * 0.2 + time * 2.2);
              break;
            case 3: // 綜合響應
              amplitude +=
                (energy / 1200) * Math.sin(x * 0.09 + time * 1.7 + index * 0.3);
              amplitude += (pitch / 2000) * Math.cos(x * 0.11 + time * 2.8);
              break;
          }

          // 添加層次效果
          amplitude *= 1 + 0.3 * Math.sin(time * 0.5 + index);

          positions[i * 3 + 1] =
            amplitude * 4 * Math.sin(x * 0.1 + time * 0.8 + index * 0.4);
        }

        geometry.attributes.position.needsUpdate = true;

        // 更新線條透明度
        const material = line.material as THREE.LineBasicMaterial;
        material.opacity = 0.6 + (energy / 2000) * Math.sin(time + index);
      });

      // 更新粒子系統
      particleSystemsRef.current.forEach((particles, index) => {
        particles.rotation.y += 0.001 + energy / 8000;
        particles.rotation.x += 0.0005 + loudness / 1000;
        particles.rotation.z += 0.0008;

        const material = particles.material as THREE.PointsMaterial;
        material.size = 0.08 + index * 0.03 + loudness / 150;
        material.opacity = 0.6 + energy / 3000;
      });

      // 更新能量環
      energyRingsRef.current.forEach((ring, index) => {
        ring.rotation.z += (0.008 + energy / 3000) * (index % 2 === 0 ? 1 : -1);
        ring.rotation.y += 0.003;
        ring.scale.setScalar(1 + (loudness / 300) * Math.sin(time * 2 + index));

        const material = ring.material as THREE.MeshBasicMaterial;
        material.opacity = 0.4 + (energy / 2500) * Math.sin(time + index);
      });

      // 更新全息平面
      hologramPlanesRef.current.forEach((plane, index) => {
        const material = plane.material as THREE.MeshBasicMaterial;
        material.opacity = 0.1 + (energy / 3000) * Math.sin(time * 1.5 + index);
        plane.rotation.y += 0.003 * (index % 2 === 0 ? 1 : -1);
        plane.rotation.z += 0.001;
      });
    }

    // 相機運動 (慢1/10的速度)
    const slowTime = time * 0.1; // 將速度降低到1/10
    const cameraRadius = 60 + Math.sin(slowTime * 0.4) * 15;
    cameraRef.current.position.x = Math.cos(slowTime * 0.2) * cameraRadius;
    cameraRef.current.position.z = Math.sin(slowTime * 0.2) * cameraRadius;
    cameraRef.current.position.y = 25 + Math.sin(slowTime * 0.15) * 12;
    cameraRef.current.lookAt(0, 0, 0);

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationIdRef.current = requestAnimationFrame(animate);
  }, [audioFeatures]);

  useEffect(() => {
    const sceneData = initializeScene();
    if (sceneData) {
      animate();
    }

    // 處理視窗大小變化
    const handleResize = () => {
      if (canvasRef.current && cameraRef.current && rendererRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const aspectRatio = rect.width / rect.height;

        cameraRef.current.aspect = aspectRatio;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(rect.width, rect.height);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [initializeScene, animate]);

  return (
    <div className="w-full">
      <h3 className="cyberpunk-title text-lg mb-4 text-center">
        {t("app.fourierTransform")}
      </h3>
            <div className="canvas-container w-full h-64 lg:h-80">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ maxWidth: "100%", height: "100%" }}
          aria-label={t("accessibility.quantumVisualizer")}
        />
      </div>
      
      {/* 量子狀態指示器 */}
      {audioFeatures && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="data-card p-2">
            <span className="theme-muted">{t("quantum.quantumState")}:</span>
            <span className="ml-1 theme-accent font-bold">
              {audioFeatures.energy > 500 ? t("quantum.excitedState") : t("quantum.groundState")}
            </span>
          </div>
          <div className="data-card p-2">
            <span className="theme-muted">{t("quantum.entanglement")}:</span>
            <span className="ml-1 theme-accent font-bold">
              {Math.min(100, Math.round(audioFeatures.hfc * 10))}{t("units.percent")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumVisualizer;
