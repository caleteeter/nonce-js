// file nonce-mgr.ts
import axios from 'axios';
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

        let currentNonce: number = await this.getNonceFromChain(context);
        this._nonces.set(context.accountAddress, currentNonce + 1);
        return this._nonces.get(context.accountAddress);
    }

    private async getNonceFromChain(context: IBlockchainContext): Promise<number> {
        let nonceResult = await axios.post(context.rpcEndpoint, `{"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["${context.accountAddress}", "pending"],"id":1}`)
        return parseInt(nonceResult.data.result, 16);
    }
}