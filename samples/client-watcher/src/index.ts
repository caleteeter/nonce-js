
import { NonceWatcher } from '@windozer/nonce-js';

const nw = new NonceWatcher();

nw.startTxMonitor();

let si = setTimeout(() => {
    nw.stopTxMonitor();
}, 10000);