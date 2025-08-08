// src/lib/auth.js
import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("Please set JWT_SECRET in .env.local");

export function signToken(payload, expiresIn = "7d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export function setTokenCookie(resHeaders, token) {
  // resHeaders is an object we will return as Response headers (App Router usage)
  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  // Add Set-Cookie header (for Next.js App Router we return Response with headers)
  resHeaders["Set-Cookie"] = cookie;
}

export function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return parse(cookieHeader);
}