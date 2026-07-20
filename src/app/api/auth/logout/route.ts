import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out." });

  // Clear all session cookies
  response.cookies.set("doctor_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  response.cookies.set("patient_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  // Also clear legacy admin_session if present
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });

  return response;
}
