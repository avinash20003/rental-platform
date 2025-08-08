"use client";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "renter" });
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.message || "Error");
    else setMsg("Created. You are logged in.");
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
        Register
      </h2>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
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
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          style={{
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #a5d6a7",
            outlineColor: "#4caf50",
            fontSize: 16,
            backgroundColor: "white",
            color: "#1b3a2d",
          }}
        >
          <option value="renter">Renter</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
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
          Signup
        </button>
      </form>
      {msg && (
        <p
          style={{
            marginTop: 16,
            color: msg.toLowerCase().includes("error") ? "#d32f2f" : "#2e7d32",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {msg}
        </p>
      )}

      <p
        style={{
          marginTop: 24,
          textAlign: "center",
          fontSize: 14,
          color: "#4a4a4a",
        }}
      >
        Already registered?{" "}
        <a
          href="/login"
          style={{
            color: "#388e3c",
            fontWeight: "600",
            textDecoration: "none",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Login here
        </a>
      </p>
    </div>
  );
}