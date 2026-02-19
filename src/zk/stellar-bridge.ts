import { Contract, xdr } from "@stellar/stellar-sdk";
import { Buffer } from "buffer/";

const CONTRACT_ID = "CDW5PLYH4LFOJFZGQDF7JVPJALKDXRDRGBLTN3ICELBEMLGGJABYNGPC";

export async function submitStealthMove(proof: Uint8Array, publicInputs: string[]) {
    const contract = new Contract(CONTRACT_ID);

    // Convert proof to ScVal Bytes safely
    const proofBytes = xdr.ScVal.scvBytes(Buffer.from(proof));
    
    // Safely parse the first public input
    const rawHash = publicInputs[0] || "";
    const hashHex = rawHash.startsWith('0x') ? rawHash.slice(2) : rawHash;
    
    const hashUint8 = new Uint8Array(hashHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const hashBytes = xdr.ScVal.scvBytes(Buffer.from(hashUint8));

    return contract.call("submit_move", proofBytes, hashBytes);
}