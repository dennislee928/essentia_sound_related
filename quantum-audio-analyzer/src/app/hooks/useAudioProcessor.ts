import { useState, useCallback, useRef } from "react";
import { Essentia, AudioFeatures } from "essentia.js";

export const useAudioProcessor = () => {
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(
    null
  );
  const essentiaRef = useRef<Essentia>(new Essentia());

  const processAudio = useCallback(async (audioData: Float32Array) => {
    try {
      const essentia = essentiaRef.current;
      if (!essentia) return;

      const vector = essentia.arrayToVector(audioData);

      const pitchResult = essentia.PitchYinProbabilistic(vector, {
        frameSize: 2048,
        sampleRate: 44100,
        minFrequency: 20,
        maxFrequency: 20000,
      });

      const loudnessResult = essentia.Loudness(vector);
      const spectrumResult = essentia.Spectrum(vector, {
        size: 4096,
      });
      const spectrum = essentia.vectorToArray(spectrumResult.spectrum);
      const centroidResult = essentia.Centroid(spectrumResult.spectrum);
      const energyResult = essentia.Energy(spectrumResult.spectrum);
      const hfcResult = essentia.HFC(spectrumResult.spectrum);

      setAudioFeatures({
        pitch: pitchResult.pitch,
        loudness: loudnessResult.loudness,
        centroid: centroidResult.centroid,
        energy: energyResult.energy,
        hfc: hfcResult.hfc,
        spectrum,
      });
    } catch (error) {
      console.error("Error processing audio:", error);
    }
  }, []);

  return {
    audioFeatures,
    processAudio,
  };
};
