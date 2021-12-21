# Nonce JS - Nonce Manager for Ethereum

Nonce management is something that is required when sending multiple transactions in a short period of time. The goal of the nonce for accounts in Ethereum is to enable transaction ordering and remove the ability to replay transactions. Essentially, the nonce is required on each transaction and sets the order to ensure transactions are committed in the order received.

This package is a small helper, wrapper that uses the [eth_getTransactionCount](https://eth.wiki/json-rpc/API#eth_gettransactioncount) especially when using external signers with many transactions. This package will cache the account and nonce (transaction count) to avoid calling the blockchain endpoint so frequently.

## Usage

The package can be used as a client package/library for Typescript/Javascript based applications or as a service via a Docker based container.

### _Typescript/Javascript_

Usage:

```
npm install @windozer/nonce-js
```

After installing the package, clients can use the package, a sample of this can be found [here](samples/client/). The client will pass a data structure that meets the [IBlockchainContext](src/models/iBlockchainContext.ts) interface. This allows the caller to specify the blockchain node (rpc endpoint) as well as the account to avoid any collisions with other nodes.

### _API_

Usage:

```
docker run -d -p 8080:8080 <docker image>
```

The docker image can be built using the Docker recipe, build instructions are [here](). After building and deploying the container, the same nonce generation can be invoked via a REST interface. A sample of calling this can be found in [this](samples/api/) sample.
