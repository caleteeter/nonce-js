// file index.ts

import { IBlockchainContext, NonceManager } from '@windozer/nonce-js';

class BlockchainContext implements IBlockchainContext {
    rpcEndpoint: string;
    accountAddress: string;

    constructor(rpcEndpoint: string, accountAddress: string) {
        this.rpcEndpoint = rpcEndpoint;
        this.accountAddress = accountAddress;
    }
}

const nm = new NonceManager();
const bc = new BlockchainContext('<rpc endpoint>', '<account address>');

nm.getNonce(bc).then((result) => {
    console.log(`The next nonce that can be used is ${result}`);
});
