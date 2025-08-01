"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const QuantumVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);

    const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(800, 400);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const wireframeGeometry = new THREE.EdgesGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    cube.add(wireframe);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    camera.position.z = 3;

    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.02;
      cube.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.1);
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer?.dispose();
      geometry.dispose();
      material.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
    };
  }, []);

  return (
    <div className="theme-card p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center theme-text">
        量子可視化
      </h2>
      <canvas 
        ref={canvasRef} 
        className="w-full canvas-container rounded-lg"
        style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default QuantumVisualizer;
