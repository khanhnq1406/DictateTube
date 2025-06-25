import { NextResponse, type NextRequest } from "next/server";

import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { Account } from "@near-js/accounts";
import {
  ACCOUNT_ID,
  ACCOUNT_PRIVATE_KEY,
  CONTRACT_ID,
  NODE_URL,
} from "./const";

export async function GET(_request: NextRequest) {
  try {
    // Setup provider
    const provider = new JsonRpcProvider({ url: NODE_URL });
    // Setup signer from private key string
    const signer = KeyPairSigner.fromSecretKey(
      `ed25519:${ACCOUNT_PRIVATE_KEY}`
    );
    // Setup account
    const account = new Account(ACCOUNT_ID, provider, signer);

    // Call contract method
    const result = await account.callFunction({
      contractId: CONTRACT_ID,
      methodName: "get_greeting",
      args: {},
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ status: 500 });
  }
}
