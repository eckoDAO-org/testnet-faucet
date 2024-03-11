export const KADENA_NETWORK_ID = "testnet04";
export const KADENA_CHAIN_ID = "1";

export const KADENA_TX_CONFIG = {
  TTL: 28800,
  GAS_LIMIT: 100000,
  GAS_PRICE: 0.000001,
  CHAIN_ID: KADENA_CHAIN_ID,
};

export const NODE_URL = `https://api.testnet.chainweb.com/chainweb/0.0/${KADENA_NETWORK_ID}/chain/${KADENA_CHAIN_ID}/pact`;
//export const NODE_URL = `https://api.testnet.chainweb.com/chainweb/0.0/${KADENA_NETWORK_ID}/chain/${KADENA_CHAIN_ID}/pact`;
