import { NextRequest, NextResponse } from "next/server";
import { getPatientSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = getPatientSession(req);
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({
    user: {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
    },
  });
}
