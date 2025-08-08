import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Property from "../../../models/Property";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request) {
  await connectDB();
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const properties = await Property.find({ ownerId: user._id });
  return NextResponse.json(properties);
}

export async function POST(request) {
  await connectDB();
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();

  // Optional: Validate required fields here

  const newProperty = new Property({ ...data, ownerId: user._id });
  await newProperty.save();

  return NextResponse.json(newProperty, { status: 201 });
}

export async function PUT(request) {
  await connectDB();
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const property = await Property.findOne({ _id: data._id, ownerId: user._id });
  if (!property) return NextResponse.json({ error: "Property not found or access denied" }, { status: 404 });

  const allowedUpdates = [
    "title",
    "description",
    "address",
    "rentPerMonth",
    "amenities",
    "propertyType",
    "availabilityStart",
    "availabilityEnd",
    "images",
  ];

  allowedUpdates.forEach(field => {
    if (data[field] !== undefined) {
      property[field] = data[field];
    }
  });

  await property.save();

  return NextResponse.json(property);
}

export async function DELETE(request) {
  await connectDB();
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const deleted = await Property.findOneAndDelete({ _id: id, ownerId: user._id });
  if (!deleted) return NextResponse.json({ error: "Not found or access denied" }, { status: 404 });

  return NextResponse.json({ message: "Deleted successfully" });
}