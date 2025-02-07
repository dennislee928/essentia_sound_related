declare module "essentia.js" {
  export interface AudioFeatures {
    pitch: number;
    loudness: number;
    centroid: number;
    energy: number;
    hfc: number;
    spectrum: Float32Array;
  }

  export interface EssentiaVector {
    size: () => number;
    get: (index: number) => number;
    set: (index: number, value: number) => void;
  }

  export interface EssentiaResults {
    pitch: { pitch: number };
    loudness: { loudness: number };
    spectrum: { spectrum: EssentiaVector };
    centroid: { centroid: number };
    energy: { energy: number };
    hfc: { hfc: number };
  }

  export interface EssentiaInterface {
    arrayToVector: (array: Float32Array) => EssentiaVector;
    vectorToArray: (vector: EssentiaVector) => Float32Array;
    PitchYinProbabilistic: (
      vector: EssentiaVector,
      config: {
        frameSize: number;
        sampleRate: number;
        minFrequency: number;
        maxFrequency: number;
      }
    ) => EssentiaResults["pitch"];
    Loudness: (vector: EssentiaVector) => EssentiaResults["loudness"];
    Spectrum: (
      vector: EssentiaVector,
      config: { size: number }
    ) => EssentiaResults["spectrum"];
    Centroid: (spectrum: EssentiaVector) => EssentiaResults["centroid"];
    Energy: (spectrum: EssentiaVector) => EssentiaResults["energy"];
    HFC: (spectrum: EssentiaVector) => EssentiaResults["hfc"];
  }

  export class Essentia implements EssentiaInterface {
    constructor();
    arrayToVector: (array: Float32Array) => EssentiaVector;
    vectorToArray: (vector: EssentiaVector) => Float32Array;
    PitchYinProbabilistic: (
      vector: EssentiaVector,
      config: {
        frameSize: number;
        sampleRate: number;
        minFrequency: number;
        maxFrequency: number;
      }
    ) => EssentiaResults["pitch"];
    Loudness: (vector: EssentiaVector) => EssentiaResults["loudness"];
    Spectrum: (
      vector: EssentiaVector,
      config: { size: number }
    ) => EssentiaResults["spectrum"];
    Centroid: (spectrum: EssentiaVector) => EssentiaResults["centroid"];
    Energy: (spectrum: EssentiaVector) => EssentiaResults["energy"];
    HFC: (spectrum: EssentiaVector) => EssentiaResults["hfc"];
  }

  export const EssentiaWASM: {
    Module: WebAssembly.Module;
    memory: WebAssembly.Memory;
    HEAP8: Int8Array;
    HEAP16: Int16Array;
    HEAP32: Int32Array;
    HEAPU8: Uint8Array;
    HEAPU16: Uint16Array;
    HEAPU32: Uint32Array;
    HEAPF32: Float32Array;
    HEAPF64: Float64Array;
  };
}

declare module "essentia.js/dist/essentia-wasm.web" {
  const content: EssentiaModule;
  export default content;
}
