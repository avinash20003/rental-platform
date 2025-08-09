"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function OwnerDashboard() {
  const searchParams = useSearchParams();
  const ownerId = searchParams.get("ownerId");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    rentPerMonth: "",
    amenities: "",
    propertyType: "",
    availabilityStart: "",
    availabilityEnd: "",
    images: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ownerId || !token) return;

    fetch(`/api/owner/get/${ownerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch(() => setError("Failed to fetch properties"));
  }, [ownerId, token]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      title: form.title,
      description: form.description,
      address: form.address,
      rentPerMonth: Number(form.rentPerMonth),
      amenities: form.amenities.split(",").map((a) => a.trim()),
      propertyType: form.propertyType,
      availabilityStart: form.availabilityStart,
      availabilityEnd: form.availabilityEnd,
      images: form.images.split(",").map((i) => i.trim()),
    };

    try {
      let res;
      if (editId) {
        res = await fetch(`/api/owner/edit/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/owner/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error");
      }

      const data = await res.json();

      if (editId) {
        setProperties((props) => props.map((p) => (p._id === data._id ? data : p)));
        setEditId(null);
      } else {
        setProperties((props) => [...props, data]);
      }

      setForm({
        title: "",
        description: "",
        address: "",
        rentPerMonth: "",
        amenities: "",
        propertyType: "",
        availabilityStart: "",
        availabilityEnd: "",
        images: "",
      });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this property?")) return;

    const res = await fetch(`/api/owner/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setProperties((props) => props.filter((p) => p._id !== id));
    } else {
      alert("Failed to delete");
    }
  }

  function startEdit(prop) {
    setEditId(prop._id);
    setForm({
      title: prop.title,
      description: prop.description,
      address: prop.address,
      rentPerMonth: prop.rentPerMonth,
      amenities: prop.amenities.join(", "),
      propertyType: prop.propertyType,
      availabilityStart: prop.availabilityStart
        ? new Date(prop.availabilityStart).toISOString().slice(0, 10)
        : "",
      availabilityEnd: prop.availabilityEnd
        ? new Date(prop.availabilityEnd).toISOString().slice(0, 10)
        : "",
      images: prop.images.join(", "),
    });
  }

  return (
    <div
      className="container"
      style={{
        padding: "20px",
        maxWidth: "700px",
        margin: "auto",
        backgroundColor: "white",
        color: "green",
        borderRadius: "8px",
      }}
    >
      <h1>Owner Dashboard</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <h2>{editId ? "Edit Property" : "Add Property"}</h2>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <input
          name="rentPerMonth"
          placeholder="Rent per month"
          type="number"
          value={form.rentPerMonth}
          onChange={handleChange}
          required
        />
        <input
          name="amenities"
          placeholder="Amenities (comma separated)"
          value={form.amenities}
          onChange={handleChange}
        />
        <input
          name="propertyType"
          placeholder="Property Type"
          value={form.propertyType}
          onChange={handleChange}
          required
        />
        <label>
          Availability Start:
          <input
            name="availabilityStart"
            type="date"
            value={form.availabilityStart}
            onChange={handleChange}
          />
        </label>
        <label>
          Availability End:
          <input
            name="availabilityEnd"
            type="date"
            value={form.availabilityEnd}
            onChange={handleChange}
          />
        </label>
        <input
          name="images"
          placeholder="Image URLs (comma separated)"
          value={form.images}
          onChange={handleChange}
        />
        <button type="submit">{editId ? "Update" : "Add"}</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({
                title: "",
                description: "",
                address: "",
                rentPerMonth: "",
                amenities: "",
                propertyType: "",
                availabilityStart: "",
                availabilityEnd: "",
                images: "",
              });
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Your Properties</h2>
      {properties.length === 0 && <p>No properties added yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {properties.map((p) => (
          <li
            key={p._id}
            style={{
              border: "1px solid #008000",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <strong>{p.title}</strong> - {p.propertyType} - ₹{p.rentPerMonth}/month
            <br />
            <strong>Description:</strong> {p.description}
            <br />
            <strong>Address:</strong> {p.address}
            <br />
            <strong>Amenities:</strong> {p.amenities.join(", ")}
            <br />
            <strong>Availability:</strong>{" "}
            {new Date(p.availabilityStart).toLocaleDateString()} to{" "}
            {new Date(p.availabilityEnd).toLocaleDateString()}
            <br />
            <strong>Images:</strong>{" "}
            {p.images
              .filter((img) => img)
              .map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`property image ${i + 1}`}
                  style={{ width: "100px", marginRight: "10px" }}
                />
              ))}
            <br />
            <button onClick={() => startEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p._id)} style={{ marginLeft: "10px" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
