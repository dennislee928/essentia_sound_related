import { useState, useCallback, useRef } from "react";
import { Essentia, AudioFeatures } from "essentia.js";

export const useAudioProcessor = () => {
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(
    null
  );
  const essentiaRef = useRef<Essentia>(new Essentia(null));

  const processAudio = useCallback(async (audioData: Float32Array) => {
    try {
      const features = await essentiaRef.current.computeFeatures(audioData);
      setAudioFeatures(features);
      return features;
    } catch (error) {
      console.error("Error processing audio:", error);
      return null;
    }
  }, []);

  return {
    audioFeatures,
    processAudio,
  };
};
