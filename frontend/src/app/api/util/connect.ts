import { connect, keyStores, KeyPair, Account, Near } from "near-api-js";
import { ACCOUNT_ID, ACCOUNT_PRIVATE_KEY, NODE_URL } from "../const";

// Singleton instances for connection pooling
let nearInstance: Near | null = null;
let accountInstance: Account | null = null;

const Connect = async () => {
  // Reuse existing instances if available
  if (accountInstance) {
    return accountInstance;
  }

  // Validate required environment variables
  if (!ACCOUNT_ID || !ACCOUNT_PRIVATE_KEY) {
    throw new Error(
      "Missing ACCOUNT_ID or ACCOUNT_PRIVATE_KEY environment variables",
    );
  }

  // Create key store
  const keyStore = new keyStores.InMemoryKeyStore();
  const keyPair = KeyPair.fromString(`ed25519:${ACCOUNT_PRIVATE_KEY}`);
  await keyStore.setKey("testnet", ACCOUNT_ID, keyPair);

  // Configure near connection
  const config = {
    networkId: "testnet",
    keyStore,
    nodeUrl: NODE_URL || "https://rpc.testnet.near.org",
    walletUrl: "https://testnet.mynearwallet.com/",
    helperUrl: "https://testnet.helper.near.org",
    explorerUrl: "https://testnet.nearblocks.io",
  };

  nearInstance = await connect(config);
  accountInstance = await nearInstance.account(ACCOUNT_ID);

  return accountInstance;
};

// Reset connection when needed
const resetConnection = () => {
  nearInstance = null;
  accountInstance = null;
};

export { Connect, resetConnection };
