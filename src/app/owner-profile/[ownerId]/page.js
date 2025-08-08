'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OwnerProfilePage() {
  const params = useParams();
  const ownerId = params.ownerId; // changed from params.id to match new folder [ownerId]

  const [properties, setProperties] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    rentPerMonth: "",
    amenities: "",
    propertyType: "apartment",
    availabilityStart: "",
    availabilityEnd: "",
    images: "",
  });

  async function fetchProperties() {
    if (!ownerId) return;

    const res = await fetch(`/api/properties?ownerId=${ownerId}&role=owner`);
    if (res.ok) {
      const data = await res.json();
      setProperties(data);
    } else {
      alert("Failed to load properties");
    }
  }

  useEffect(() => {
    fetchProperties();
  }, [ownerId]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submitProperty(e) {
    e.preventDefault();

    if (!ownerId) {
      alert("Owner ID missing");
      return;
    }

    const method = editing ? "PUT" : "POST";

    const body = {
      ...form,
      amenities: form.amenities.split(",").map((a) => a.trim()),
      rentPerMonth: Number(form.rentPerMonth),
      availabilityStart: form.availabilityStart ? new Date(form.availabilityStart) : null,
      availabilityEnd: form.availabilityEnd ? new Date(form.availabilityEnd) : null,
      images: form.images ? form.images.split(",").map((i) => i.trim()) : [],
      ownerId,
      role: "owner",
    };

    if (editing) body._id = editing._id;

    const res = await fetch("/api/properties", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setEditing(null);
      setForm({
        title: "",
        description: "",
        address: "",
        rentPerMonth: "",
        amenities: "",
        propertyType: "apartment",
        availabilityStart: "",
        availabilityEnd: "",
        images: "",
      });
      fetchProperties();
    } else {
      alert("Error saving property");
    }
  }

  async function deleteProperty(id) {
    if (!ownerId) {
      alert("Owner ID missing");
      return;
    }
    if (!confirm("Are you sure you want to delete this property?")) return;

    const res = await fetch(`/api/properties?id=${id}&ownerId=${ownerId}&role=owner`, { method: "DELETE" });

    if (res.ok) fetchProperties();
    else alert("Error deleting property");
  }

  function startEdit(property) {
    setEditing(property);
    setForm({
      title: property.title,
      description: property.description || "",
      address: property.address?.text || property.address || "",
      rentPerMonth: property.rentPerMonth,
      amenities: (property.amenities || []).join(", "),
      propertyType: property.propertyType,
      availabilityStart: property.availabilityStart ? property.availabilityStart.slice(0, 10) : "",
      availabilityEnd: property.availabilityEnd ? property.availabilityEnd.slice(0, 10) : "",
      images: (property.images || []).join(", "),
    });
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Owner Profile - Manage Properties</h1>

      <form onSubmit={submitProperty} style={{ marginBottom: 24, display: "grid", gap: 12 }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleInputChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleInputChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleInputChange} />
        <input
          name="rentPerMonth"
          placeholder="Rent per month"
          type="number"
          value={form.rentPerMonth}
          onChange={handleInputChange}
          required
        />
        <input
          name="amenities"
          placeholder="Amenities (comma separated)"
          value={form.amenities}
          onChange={handleInputChange}
        />
        <select name="propertyType" value={form.propertyType} onChange={handleInputChange}>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="studio">Studio</option>
          <option value="other">Other</option>
        </select>
        <label>
          Availability start:
          <input type="date" name="availabilityStart" value={form.availabilityStart} onChange={handleInputChange} />
        </label>
        <label>
          Availability end:
          <input type="date" name="availabilityEnd" value={form.availabilityEnd} onChange={handleInputChange} />
        </label>
        <input name="images" placeholder="Image URLs (comma separated)" value={form.images} onChange={handleInputChange} />

        <button type="submit">{editing ? "Update Property" : "Add Property"}</button>
        {editing && (
          <button type="button" onClick={() => {
            setEditing(null);
            setForm({
              title: "",
              description: "",
              address: "",
              rentPerMonth: "",
              amenities: "",
              propertyType: "apartment",
              availabilityStart: "",
              availabilityEnd: "",
              images: "",
            });
          }}>
            Cancel
          </button>
        )}
      </form>

      <h2>Your Properties</h2>
      {properties.length === 0 ? (
        <p>No properties yet.</p>
      ) : (
        <ul>
          {properties.map((p) => (
            <li key={p._id} style={{ marginBottom: 12, borderBottom: "1px solid #ccc", paddingBottom: 8 }}>
              <strong>{p.title}</strong> - {p.propertyType} - ₹{p.rentPerMonth} / month
              <br />
              <small>{p.address?.text || "No address provided"}</small>
              <br />
              <button onClick={() => startEdit(p)}>Edit</button>{" "}
              <button onClick={() => deleteProperty(p._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
