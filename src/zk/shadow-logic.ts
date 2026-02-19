import { Buffer } from "buffer/";

export async function generateMoveProof(oldX: number, oldY: number, newX: number, newY: number) {
    if (typeof window !== 'undefined') {
        (window as any).global = window;
        (window as any).Buffer = Buffer;
    }

    const { Noir } = await import("@noir-lang/noir_js");
    const { UltraHonkBackend } = await import("@noir-lang/backend_barretenberg");

    try {
        const response = await fetch('/circuits/target/circuits.json');
        const circuitData = await response.json();
        const rawBytecode = circuitData.bytecode || circuitData.circuit;

        // --- THE BYPASS ---
        // We decode it here so the backend doesn't have to.
        const binaryString = window.atob(rawBytecode);
        const acirBuffer = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            acirBuffer[i] = binaryString.charCodeAt(i);
        }

        console.log("SHADOW-LOG: Initializing Backend with pre-decoded bytes...");
        // Passing the Uint8Array directly avoids the internal base64Decode call
        const backend = new UltraHonkBackend(acirBuffer); 
        
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
        console.error("FULL ERROR:", err);
        throw new Error(`[Noir Engine Panic]: ${err.message}`);
    }
}