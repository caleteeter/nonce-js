// file nonce-mgr.test.ts

import { mock } from 'jest-mock-extended';
import axios from 'axios';
import { IBlockchainContext, NonceManager } from '../src/index';

let bc: IBlockchainContext;

describe("Nonce manager tests", () => {
    beforeAll(() => {
        bc = mock<IBlockchainContext>({ rpcEndpoint: "http://localhost", accountAddress: "0x1" });
    });

    it("Nonce should advance by one, from the nonce retrieved from chain", async () => {
        axios.post = jest.fn().mockResolvedValue(JSON.parse('{"data": { "result": "3E7" }}'));
        let nm = new NonceManager();
        let result = await nm.getNonce(bc);
        expect(result).toBe(1000);
    });

    it("Nonce should be 1 for a new account", async () => {
        axios.post = jest.fn().mockResolvedValue(JSON.parse('{"data": { "result": "0" }}'));
        let nm = new NonceManager();
        let result = await nm.getNonce(bc);
        expect(result).toBe(1);
    });

    it("Should return success for adding a new nonce as unconfirmed", async () => {
        let nm = new NonceManager();
        let result = await nm.addUnconfirmedNonce(bc, 1);
        expect(result.message).toBe("Added nonce to account 0x1");
    });

    it("Should return success for ordering unconfirmed nonces", async () => {
        let nm = new NonceManager();

        let result1 = await nm.addUnconfirmedNonce(bc, 2);
        let result2 = await nm.addUnconfirmedNonce(bc, 1);
        let result3 = await nm.addUnconfirmedNonce(bc, 4);
        let result4 = await nm.addUnconfirmedNonce(bc, 3);
        let result5 = await nm.getUnconfirmedNonce(bc, true);

        expect(result1.message).toBe("Added nonce to account 0x1");
        expect(result2.message).toBe("Added nonce to account 0x1");
        expect(result3.message).toBe("Added nonce to account 0x1");
        expect(result4.message).toBe("Added nonce to account 0x1");

        expect((result5 as number[]).length).toBe(4);
        expect((result5 as number[])[0]).toBe(1);
    });

    it("Should fail to return unconfirmed nonce when non exists", async () => {
        let nm = new NonceManager();
        let result = await nm.getUnconfirmedNonce(bc, true);
        expect(result).toBe(-1);
    });

    it("Should confirm clearing of unconfirmed nonces", async () => {
        let nm = new NonceManager();
        let result1 = await nm.addUnconfirmedNonce(bc, 1);
        let result2 = await nm.clearUnconfirmedNonce(bc);
        let result3 = await nm.getUnconfirmedNonce(bc, true);

        expect(result1.message).toBe("Added nonce to account 0x1");
        expect(result2.message).toBe("Nonces for account 0x1 have been cleared.")
        expect(result3).toBe(-1);
    });

    it("Should pass to show using the unconfirmed nonces", async () => {
        let nm = new NonceManager();
        await nm.addUnconfirmedNonce(bc, 1);
        let result = await nm.getNonce(bc);

        expect(result).toBe(1);
    });
});