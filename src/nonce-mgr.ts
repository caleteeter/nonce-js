// file nonce-mgr.ts
import axios from 'axios';
import { IBlockchainContext } from "./models/IBlockchainContext";
import { NonceResponse } from "./models/NonceResponse";

export class NonceManager {

    readonly _nonces: Map<string, number>;
    readonly _unconsumedNonces: Map<string, Array<number>>;

    constructor() {
        this._nonces = new Map();
        this._unconsumedNonces = new Map();
    }

    async getNonce(context: IBlockchainContext): Promise<number | undefined> {
        const uNonce = await this.getUnconfirmedNonce(context);
        if (uNonce !== -1) {
            return (uNonce as number);
        }
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

    async getUnconfirmedNonce(context: IBlockchainContext, includeAll: boolean = false): Promise<number | number[]> {
        if (this._unconsumedNonces.has(context.accountAddress)) {
            if (includeAll) {
                return (this._unconsumedNonces.get(context.accountAddress) as number[]).sort();
            }
            return (this._unconsumedNonces.get(context.accountAddress) as number[]).sort()[0];
        }
        return -1;
    }

    async addUnconfirmedNonce(context: IBlockchainContext, nonce: number): Promise<NonceResponse> {
        const currentNonces = this._unconsumedNonces.get(context.accountAddress);

        if (currentNonces as number[]) {
            let cn = currentNonces as number[];
            cn.push(nonce);
            this._unconsumedNonces.set(context.accountAddress, cn);
            return { message: `Added nonce to account ${context.accountAddress}` };
        } else {
            this._unconsumedNonces.set(context.accountAddress, [1]);
        }

        return { message: `Added nonce to account ${context.accountAddress}` };
    }

    async clearUnconfirmedNonce(context: IBlockchainContext): Promise<NonceResponse> {
        if (this._unconsumedNonces.has(context.accountAddress)) {
            this._unconsumedNonces.delete(context.accountAddress);
            return { message: `Nonces for account ${context.accountAddress} have been cleared.` };
        }
        return { message: `Nonces for account ${context.accountAddress} could not be found.` };
    }
}