import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CAJF3NN4J6ZPNKMM3YQKU6JLEWE5ONWU4OSMAOCGQ4HWGLE65BWZPAUL",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAAJZW5kX21hdGNoAAAAAAAAAAAAAAA=",
            "AAAAAAAAAAAAAAALc3RhcnRfbWF0Y2gAAAAAAQAAAAAAAAAGcGxheWVyAAAAAAATAAAAAA==",
            "AAAAAAAAAAAAAAALc3VibWl0X21vdmUAAAAAAgAAAAAAAAAFcHJvb2YAAAAAAAAOAAAAAAAAAAhuZXdfaGFzaAAAAA4AAAAA"]), options);
        this.options = options;
    }
    fromJSON = {
        end_match: (this.txFromJSON),
        start_match: (this.txFromJSON),
        submit_move: (this.txFromJSON)
    };
}
