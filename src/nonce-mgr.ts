// file nonce-mgr.ts

import Web3 from "web3";
import { IBlockchainContext } from "./models/iBlockchainContext";

export class NonceManager {

    readonly _nonces: Map<string, number>;

    constructor() {
        this._nonces = new Map();
    }

    async getNonce(context: IBlockchainContext): Promise<number | undefined> {
        if (this._nonces.has(context.accountAddress)) {
            let currentNonce = this._nonces.get(context.accountAddress);
            this._nonces.set(context.accountAddress, currentNonce === undefined ? 1 : currentNonce + 1)
            return this._nonces.get(context.accountAddress);
        }

        let currentNonce: number = await this.getNonceFromChain(context.rpcEndpoint, context.accountAddress);
        this._nonces.set(context.accountAddress, currentNonce + 1);
        return this._nonces.get(context.accountAddress);
    }

    private async getNonceFromChain(rpcEndpoint: string, address: string): Promise<number> {
        const node: Web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint));
        return await node.eth.getTransactionCount(address, "pending");
    }
}