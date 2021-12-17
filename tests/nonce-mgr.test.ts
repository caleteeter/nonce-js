// file nonce-mgr.test.ts

import { getNonce } from "../src/nonce-mgr";

describe("Nonce manager module tests", () => {
    it("should get a nonce for a new account", async () => {
        let result = await getNonce("http://127.0.0.1:8545", "0x0000000000000000000000000000000000000000");
        expect(result).toBe(1);
    });

    it("should return a nonce higher than 1 for an existing account", async () => {
        let result = await getNonce("http://127.0.0.1:8545", "0x52c0980d884dBB7455Fa288659Eb84e2EE3c3d5f");
        expect(result).toBeGreaterThan(1);
    });
});