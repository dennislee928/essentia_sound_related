declare module "qiskit" {
  export interface QuantumCircuit {
    h(qubit: number): void; // Hadamard gate
    cx(control: number, target: number): void; // CNOT gate
    measure(qubit: number): void;
    run(): Promise<QuantumResult>;
  }

  export class Aer {
    static getBackend(name: string): QiskitBackend;
  }

  export class execute {
    static run(
      circuit: QuantumCircuit,
      backend: QiskitBackend
    ): Promise<QuantumResult>;
  }
}

interface QuantumResult {
  counts: Record<string, number>;
  statevector: number[];
}

interface QiskitBackend {
  name: string;
  status: string;
  configuration: Record<string, unknown>;
}
