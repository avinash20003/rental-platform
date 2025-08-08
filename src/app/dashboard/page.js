"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(d => {
      setUser(d.user);
    });
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }

  async function callAdmin() {
    const res = await fetch("/api/admin-only");
    const data = await res.json();
    setMsg(JSON.stringify(data));
  }

  if (user === null) {
    return <div style={{padding:20}}>Loading user...</div>;
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>

          <div style={{ marginTop: 12 }}>
            {user.role === "admin" && <button onClick={callAdmin}>Call Admin API</button>}
            <button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>
          </div>
          {msg && <pre style={{ marginTop: 12 }}>{msg}</pre>}
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <a href="/login">Login</a>
        </div>
      )}
    </div>
  );
}