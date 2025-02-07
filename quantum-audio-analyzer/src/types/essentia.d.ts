declare module "essentia.js" {
  export interface AudioFeatures {
    pitch: number;
    loudness: number;
    bpm: number;
    // 添加其他音頻特徵
  }

  export interface EssentiaModule {
    default: {
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

  export class Essentia {
    constructor(wasmModule: EssentiaModule | null);
    computeFeatures(audioData: Float32Array): Promise<AudioFeatures>;
  }
}
