import connectDB from '../../../../../../lib/mongodb';
import Property from '../../../../../../models/Property';
import { verifyToken } from '../../../../../../lib/jwt';
import mongoose from 'mongoose';

export async function DELETE(req, { params }) {
  await connectDB();

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
  if (!property) return new Response(JSON.stringify({ message: 'Property not found' }), { status: 404 });

  if (property.ownerId.toString() !== user.id) {
    return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
  }

  await property.deleteOne();

  return new Response(JSON.stringify({ message: 'Property deleted' }), { status: 200 });
}
