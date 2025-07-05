import { NextResponse } from "next/server";

import { CONTRACT_ID } from "../const";
import { Connect, resetConnection } from "../util/connect";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    console.log("🔍 Debug: Starting blockchain call...");
    console.log("🔍 Debug: CONTRACT_ID:", CONTRACT_ID);
    console.log("🔍 Debug: ACCOUNT_ID:", process.env.ACCOUNT_ID);
    console.log("🔍 Debug: NODE_URL:", process.env.NODE_URL);

    const connect = Connect();
    console.log("🔍 Debug: Connection established");

    let result;

    if (id) {
      console.log("🔍 Debug: Calling get_score_by_id with id:", id);
      // Call contract method with ID
      result = await connect.callFunction({
        contractId: CONTRACT_ID,
        methodName: "get_score_by_id",
        args: { id },
      });
    } else {
      console.log("🔍 Debug: Calling get_score without id");
      // Call contract method without ID
      result = await connect.callFunction({
        contractId: CONTRACT_ID,
        methodName: "get_score",
        args: {},
      });
    }

    console.log("🔍 Debug: Call successful, result:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Blockchain connection error:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Reset connection on error for next request
    resetConnection();

    return NextResponse.json({
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function POST(request: Request) {
  const { id, username, totalPoint } = await request.json();

  try {
    const connect = Connect();
    await connect.callFunction({
      contractId: CONTRACT_ID,
      methodName: "set_score",
      args: { id, username, totalPoint },
    });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Blockchain connection error:", error);

    // Reset connection on error for next request
    resetConnection();

    return NextResponse.json({
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function DELETE() {
  try {
    resetConnection();
    return NextResponse.json({
      status: 200,
      message: "Connection reset successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
