"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push("/login");  // Redirect to login if not authenticated
      });
  }, [router]);

  if (loading) return <p>Loading...</p>;

  // If user is logged in, show dashboard or data page
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Welcome {user.name}</h1>
      {/* Your dashboard or data display component here */}
    </div>
  );
}