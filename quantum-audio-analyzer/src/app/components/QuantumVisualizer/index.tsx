"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const QuantumVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 初始化 Three.js
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
    });

    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current)
        return;

      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    return () => {
      rendererRef.current?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default QuantumVisualizer;
