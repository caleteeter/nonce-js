// file nonce-mgr.ts

import Web3 from "web3";

const nonces: Map<string, number> = new Map();

export async function getNonce(rpcEndpoint: string, address: string): Promise<number | undefined> {
    if (nonces.has(address)) {
        let currentNonce = nonces.get(address);
        nonces.set(address, currentNonce === undefined ? 1 : currentNonce++)
        return nonces.get(address);
    }

    let currentNonce: number = await getNonceFromChain(rpcEndpoint, address);
    nonces.set(address, currentNonce + 1);
    return nonces.get(address);
}

async function getNonceFromChain(rpcEndpoint: string, address: string): Promise<number> {
    const node: Web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint));
    return await node.eth.getTransactionCount(address);
}