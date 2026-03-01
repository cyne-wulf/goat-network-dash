import { NextResponse } from "next/server";
import { readLogs } from "@/lib/x402/logStore";

export async function GET() {
  try {
    const logs = await readLogs();
    const ordered = [...logs].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return NextResponse.json(ordered, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
