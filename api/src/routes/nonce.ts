// file nonce.ts

import { Router } from 'express';
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
const router = Router();

router.post('/', async (req, res, next) => {
    const bc = new BlockchainContext(req.body.rpcEndpoint, req.body.accountAddress);
    try {
        let result = await nm.getNonce(bc);
        return res.send(result?.toString());
    } catch (err) {
        next(err);
    }
});

router.post('/unconsumed', async (req, res, next) => {
    const bc = new BlockchainContext(req.body.rpcEndpoint, req.body.accountAddress);
    try {
        if (req.query.nonceId !== undefined) {
            let result = await nm.addUnconfirmedNonce(bc, parseInt((req.query.nonceId as string)));
            return res.send(JSON.stringify(result));
        }
        return res.send("No nonce provided.");
    } catch (err) {
        next(err);
    }
});

export default router;