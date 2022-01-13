// file nonce-watcher.ts

import axios from 'axios';
var Web3 = require('web3');

export class NonceWatcher {
    private _stopWatcher;
    private _nodes: string[];
    private _nonceManager: string;

    constructor(nodes: string[], nonceManager: string) {
        this._stopWatcher = false;
        this._nodes = nodes;
        this._nonceManager = nonceManager;
    }

    async startTxMonitor(interval: number = 5000): Promise<void> {
        this._stopWatcher = false;
        let watcher = setInterval(() => {
            this._nodes.forEach((node) => {
                this.getTransactionData(node);
            });

            if (this._stopWatcher) {
                clearInterval(watcher);
            }
        }, interval);
    }

    async stopTxMonitor(waitTime: number = 15000): Promise<boolean> {
        this._stopWatcher = true;
        return true;
    }

    async restartTxMonitor(waitTime: number = 15000): Promise<boolean> {
        this.stopTxMonitor().then((result) => {
            if (result === true) {
                this.startTxMonitor();
                return true;
            }
        });
        return false;
    }

    private async getTransactionData(node: string): Promise<void> {
        let syncingResult = await axios.post(node, `{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}`);
        if (syncingResult.data.result === "false") {
            return;
        }

        let web3 = new Web3(new Web3.providers.HttpProvider(node));

        web3.eth.extend({
            property: 'txpool',
            methods: [{
                name: 'content',
                call: 'txpool_content'
            }]
        });

        web3.eth.txpool.content().then(async (result) => {
            let ekeys = Object.keys(result.pending);
            for (const k of ekeys) {
                let fkeys = Object.keys(result.pending[k]);
                for (const l of fkeys) {
                    await axios.post(`${this._nonceManager}/nonces/unconsumed`);
                }
            }

            let gkeys = Object.keys(result.queued);
            for (const m of gkeys) {
                let hkeys = Object.keys(result.queued[m]);
                for (const n of hkeys) {
                    await axios.post(`${this._nonceManager}/nonces/unconsumed`);
                }
            }
        });
    }
}