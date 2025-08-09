"use client";

import Login from "./(auth)/login/page";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Login />
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Don't have an account?{" "}
        <Link href="/signup" style={{ color: "blue", textDecoration: "underline" }}>
          Sign up here
        </Link>
      </p>
    </div>
  );
}
