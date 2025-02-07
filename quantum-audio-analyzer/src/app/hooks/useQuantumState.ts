import { useState, useCallback } from "react";
import { AudioFeatures } from "essentia.js";

interface QuantumState {
  amplitude: number;
  phase: number;
  probability: number;
}

export const useQuantumState = () => {
  const [quantumState, setQuantumState] = useState<QuantumState | null>(null);

  const processQuantumState = useCallback((audioFeatures: AudioFeatures) => {
    const newState: QuantumState = {
      amplitude: audioFeatures.loudness / 100,
      phase: audioFeatures.pitch / 360,
      probability: Math.pow(audioFeatures.loudness / 100, 2),
    };

    setQuantumState(newState);
    return newState;
  }, []);

  return {
    quantumState,
    processQuantumState,
  };
};
