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
  const neonGridRef = useRef<THREE.LineSegments | null>(null);

  const initializeScene = useCallback(() => {
    if (!canvasRef.current) return;

    // 清理舊場景
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // 純黑背景
    scene.fog = new THREE.Fog(0x000000, 10, 100); // 添加霧效

    const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
    camera.position.set(0, 20, 50);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(800, 400);
    renderer.setClearColor(0x000000);

    // === CYBERPUNK 視覺元素 ===

    // 1. 動態波形線條 (多層，不同顏色)
    const waveformLines: THREE.Line[] = [];
    const waveformColors = [
      0x00ffff, // 青色
      0xff00ff, // 洋紅
      0x00ff00, // 綠色
      0xffff00, // 黃色
      0xff0080, // 粉紅
      0x8000ff, // 紫色
    ];

    for (let layer = 0; layer < 6; layer++) {
      const points: THREE.Vector3[] = [];
      const segments = 200;

      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * 60 - 30;
        const y = Math.sin(i * 0.1 + layer) * 2;
        const z = layer * 3 - 9;
        points.push(new THREE.Vector3(x, y, z));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: waveformColors[layer],
        transparent: true,
        opacity: 0.8,
        linewidth: 2,
      });

      const line = new THREE.Line(geometry, material);
      scene.add(line);
      waveformLines.push(line);
    }

    // 2. 粒子系統 (多個不同大小的粒子雲)
    const particleSystems: THREE.Points[] = [];

    for (let system = 0; system < 3; system++) {
      const particleCount = 2000 + system * 1000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        // 隨機分布在球體內
        const radius = 20 + system * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = Math.random() * radius;

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        // Cyberpunk 顏色
        const colorChoice = Math.random();
        if (colorChoice < 0.3) {
          colors[i * 3] = 0;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 1; // 青色
        } else if (colorChoice < 0.6) {
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0;
          colors[i * 3 + 2] = 1; // 洋紅
        } else {
          colors[i * 3] = 0;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 0; // 綠色
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.1 + system * 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particleSystems.push(particles);
    }

    // 3. 能量環 (旋轉的霓虹環)
    const energyRings: THREE.Mesh[] = [];

    for (let ring = 0; ring < 5; ring++) {
      const geometry = new THREE.TorusGeometry(8 + ring * 3, 0.5, 8, 32);
      const material = new THREE.MeshBasicMaterial({
        color: ring % 2 === 0 ? 0x00ffff : 0xff00ff,
        transparent: true,
        opacity: 0.4,
        wireframe: true,
      });

      const torus = new THREE.Mesh(geometry, material);
      torus.rotation.x = Math.PI / 2;
      torus.position.y = ring * 2 - 4;
      scene.add(torus);
      energyRings.push(torus);
    }

    // 4. 全息投影平面
    const hologramPlanes: THREE.Mesh[] = [];

    for (let plane = 0; plane < 4; plane++) {
      const geometry = new THREE.PlaneGeometry(20, 15);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff80,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        wireframe: true,
      });

      const planeMesh = new THREE.Mesh(geometry, material);
      planeMesh.position.set(
        Math.cos((plane * Math.PI) / 2) * 25,
        0,
        Math.sin((plane * Math.PI) / 2) * 25
      );
      planeMesh.lookAt(0, 0, 0);
      scene.add(planeMesh);
      hologramPlanes.push(planeMesh);
    }

    // 5. 霓虹網格地板
    const gridGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.2,
      wireframe: true,
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -15;
    scene.add(grid);

    // 保存引用
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    waveformLinesRef.current = waveformLines;
    particleSystemsRef.current = particleSystems;
    energyRingsRef.current = energyRings;
    hologramPlanesRef.current = hologramPlanes;
    neonGridRef.current = grid;

    return { scene, camera, renderer };
  }, []);

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const time = Date.now() * 0.001;

    // 使用音頻特徵參數進行動態更新
    if (audioFeatures) {
      const { pitch, loudness, centroid, energy, hfc } = audioFeatures;

      // 更新波形線條
      waveformLinesRef.current.forEach((line, index) => {
        const geometry = line.geometry as THREE.BufferGeometry;
        const positions = geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < positions.length / 3; i++) {
          const x = positions[i * 3];

          // 根據音頻特徵計算振幅
          let amplitude = 1;
          amplitude += (loudness / 30) * Math.sin(x * 0.1 + time * 2 + index);
          amplitude += (pitch / 2000) * Math.cos(x * 0.05 + time + index * 0.5);
          amplitude += (energy / 1000) * Math.sin(x * 0.15 + time * 1.5);

          positions[i * 3 + 1] =
            amplitude * 3 * Math.sin(x * 0.1 + time + index);
        }

        geometry.attributes.position.needsUpdate = true;
      });

      // 更新粒子系統
      particleSystemsRef.current.forEach((particles, index) => {
        particles.rotation.y += 0.002 + energy / 5000;
        particles.rotation.x += 0.001;

        const material = particles.material as THREE.PointsMaterial;
        material.size = 0.1 + index * 0.05 + loudness / 100;
      });

      // 更新能量環
      energyRingsRef.current.forEach((ring, index) => {
        ring.rotation.z += (0.01 + energy / 2000) * (index % 2 === 0 ? 1 : -1);
        ring.scale.setScalar(1 + (loudness / 200) * Math.sin(time + index));
      });

      // 更新全息平面
      hologramPlanesRef.current.forEach((plane, index) => {
        plane.material.opacity = 0.15 + energy / 2000;
        plane.rotation.y += 0.005 * (index % 2 === 0 ? 1 : -1);
      });
    }

    // 相機運動 (慢1/10的速度)
    const slowTime = time * 0.1; // 將速度降低到1/10
    const cameraRadius = 50 + Math.sin(slowTime * 0.5) * 10;
    cameraRef.current.position.x = Math.cos(slowTime * 0.3) * cameraRadius;
    cameraRef.current.position.z = Math.sin(slowTime * 0.3) * cameraRadius;
    cameraRef.current.position.y = 20 + Math.sin(slowTime * 0.2) * 10;
    cameraRef.current.lookAt(0, 0, 0);

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationIdRef.current = requestAnimationFrame(animate);
  }, [audioFeatures]);

  useEffect(() => {
    const sceneData = initializeScene();
    if (sceneData) {
      animate();
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
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
      <p className="mt-2 text-sm theme-muted">
        Cyberpunk 量子音頻可視化 - 實時響應音頻特徵
      </p>
    </div>
  );
};

export default QuantumVisualizer;
