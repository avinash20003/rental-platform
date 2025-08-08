// src/app/api/auth/logout/route.js
import { serialize } from "cookie";

export async function POST() {
  // overwrite cookie with expired one
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return new Response(JSON.stringify({ message: "Logged out" }), {
    status: 200,
    headers: { "Set-Cookie": cookie }
  });
}