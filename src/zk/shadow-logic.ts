// 1. FORCE THE POLYFILL AT THE WINDOW LEVEL IMMEDIATELY
import { Buffer } from "buffer/";
if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
    (window as any).global = window;
}

export async function generateMoveProof(oldX: number, oldY: number, newX: number, newY: number) {
    // 2. DYNAMIC IMPORTS AFTER POLYFILL
    const { Noir } = await import("@noir-lang/noir_js");
    const { UltraHonkBackend } = await import("@noir-lang/backend_barretenberg");

    try {
        const response = await fetch('/circuits/target/circuits.json');
        const circuitData = await response.json();
        
        // Use the raw bytecode string directly. 
        // We will let the library try one more time with a 'fixed' global environment.
        const rawBytecode = circuitData.bytecode || circuitData.circuit;

        console.log("SHADOW-LOG: Initializing Backend...");
        
        // This is the line that was crashing. 
        // By passing the STRING directly, we avoid the manual decode that was failing.
        const backend = new UltraHonkBackend(rawBytecode); 
        
        const noir = new Noir({ 
            bytecode: rawBytecode, 
            abi: circuitData.abi 
        });

        const input = { 
            old_x: oldX.toString(), 
            old_y: oldY.toString(), 
            new_x: newX.toString(), 
            new_y: newY.toString() 
        };

        console.log("SHADOW-LOG: Witnessing move...");
        const { witness } = await noir.execute(input);
        
        console.log("SHADOW-LOG: Generating Proof...");
        const proofData = await backend.generateProof(witness);

        return {
            proof: proofData.proof,
            publicInputs: proofData.publicInputs
        };

    } catch (err: any) {
        console.error("FULL ERROR OBJECT:", err);
        throw new Error(`[Noir Engine Panic]: ${err.message}`);
    }
}