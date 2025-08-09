import connectDB from '../../../../../lib/mongodb';
import Property from '../../../../../models/Property';
import { verifyToken } from '../../../../../lib/jwt';
import mongoose from 'mongoose';

export async function PUT(req, { params }) {
  await connectDB();

  console.log('params:', params);
  console.log('params.propertyId:', params.propertyId);
  console.log('isValid propertyId:', mongoose.Types.ObjectId.isValid(params.propertyId));

  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);

  if (!user || user.role !== 'owner') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(params.propertyId)) {
    return new Response(JSON.stringify({ message: 'Invalid property ID' }), { status: 400 });
  }

  const property = await Property.findById(params.propertyId);

  if (!property) {
    return new Response(JSON.stringify({ message: 'Property not found' }), { status: 404 });
  }

  if (property.ownerId.toString() !== user.id) {
    return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
  }

  const data = await req.json();

  Object.assign(property, data);

  if (data.availabilityStart) property.availabilityStart = new Date(data.availabilityStart);
  if (data.availabilityEnd) property.availabilityEnd = new Date(data.availabilityEnd);

  await property.save();

  return new Response(JSON.stringify(property), { status: 200 });
}
