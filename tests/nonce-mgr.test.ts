// file nonce-mgr.test.ts

import { mock } from 'jest-mock-extended';
import axios from 'axios';
import { IBlockchainContext, NonceManager } from '../src/index';

let bc: IBlockchainContext;

describe("Nonce manager tests", () => {
    beforeAll(() => {
        bc = mock<IBlockchainContext>({ rpcEndpoint: "", accountAddress: "" });
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
});