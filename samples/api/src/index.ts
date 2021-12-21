// file index.ts

import axios from 'axios';

axios.post("http://<server running the docker container>:8080/nonce", { "rpcEndpoint": "<rpc endpoint (e.g. http://127.0.0.1:8545)>", "accountAddress": "<account address>" }).then((result) => {
    console.log(`The next nonce that can be used is ${result.data}`);
});