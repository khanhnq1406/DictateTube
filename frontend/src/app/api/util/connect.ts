import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { Account } from "@near-js/accounts";
import { ACCOUNT_ID, ACCOUNT_PRIVATE_KEY, NODE_URL } from "../const";

// Singleton instances for connection pooling
let providerInstance: JsonRpcProvider | null = null;
let accountInstance: Account | null = null;

const Connect = (): Account => {
  // Reuse existing instances if available
  if (accountInstance) {
    return accountInstance;
  }

  // Create new instances only if they don't exist
  if (!providerInstance) {
    // Use testnet RPC if not specified
    const rpcUrl = NODE_URL || "https://rpc.testnet.near.org";
    providerInstance = new JsonRpcProvider({ url: rpcUrl });
  }

  // Validate required environment variables
  if (!ACCOUNT_ID || !ACCOUNT_PRIVATE_KEY) {
    throw new Error(
      "Missing ACCOUNT_ID or ACCOUNT_PRIVATE_KEY environment variables"
    );
  }

  const signer = KeyPairSigner.fromSecretKey(`ed25519:${ACCOUNT_PRIVATE_KEY}`);
  accountInstance = new Account(ACCOUNT_ID, providerInstance, signer);

  return accountInstance;
};

// Reset connection when needed
const resetConnection = () => {
  providerInstance = null;
  accountInstance = null;
};

export { Connect, resetConnection };
