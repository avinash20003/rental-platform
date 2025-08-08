// src/app/api/auth/signup/route.js
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { signToken, setTokenCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ message: "Email already used" }), { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    const token = signToken({ id: user._id.toString(), role: user.role, email: user.email });
    const headers = {};
    setTokenCookie(headers, token);

    return new Response(JSON.stringify({ user: { name: user.name, email: user.email, role: user.role } }), {
      status: 201,
      headers
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}