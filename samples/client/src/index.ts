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
const bc = new BlockchainContext('http://127.0.0.1:8545', '0x096F8D608686dEf03B08198161f208Cb234Df31B');

nm.getNonce(bc).then((result) => {
    console.log(`The next nonce that can be used is ${result}`);
}).then(() => {
    nm.getNonce(bc).then((result) => {
        console.log(`The next nonce that can be used is ${result}`);
    });
});