"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.message || "Login failed");
      return;
    }

    setMsg("Logged in");

    const user = data.user; // Assuming backend returns user object with _id and role

    if (user.role === "owner") {
      router.push(`/owner-profile/${user._id}`); // Redirect owners to their profile page
    } else {
      router.push("/dashboard"); // Redirect others to dashboard
    }
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "60px auto",
        padding: 24,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "white",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgb(0 128 0 / 0.15)",
        color: "#1b3a2d",
        border: "1px solid #2e7d32",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24, color: "#2e7d32" }}>
        Login
      </h2>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #a5d6a7",
            outlineColor: "#4caf50",
            fontSize: 16,
          }}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #a5d6a7",
            outlineColor: "#4caf50",
            fontSize: 16,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: "#4caf50",
            color: "white",
            fontWeight: "600",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 16,
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#388e3c")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4caf50")}
        >
          Login
        </button>
      </form>

      {msg && (
        <p
          style={{
            marginTop: 16,
            color: msg.toLowerCase().includes("failed") ? "#d32f2f" : "#2e7d32",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {msg}
        </p>
      )}

      <p style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "#4a4a4a" }}>
        Don't have an account?{" "}
        <a
          href="/register"
          style={{ color: "#388e3c", fontWeight: "600", textDecoration: "none" }}
          onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Register here
        </a>
      </p>
    </div>
  );
}