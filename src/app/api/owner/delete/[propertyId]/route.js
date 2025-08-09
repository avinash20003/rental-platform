import connectDB from '../../../../../lib/mongodb';
import Property from '../../../../../models/Property';
import { verifyToken } from '../../../../../lib/jwt';
import mongoose from 'mongoose';

export async function DELETE(req, { params }) {
  await connectDB();

  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);

  // Check user role
  if (!user || user.role !== 'owner') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  // Validate propertyId
  if (!mongoose.Types.ObjectId.isValid(params.propertyId)) {
    return new Response(JSON.stringify({ message: 'Invalid property ID' }), { status: 400 });
  }

  // Find the property
  const property = await Property.findById(params.propertyId);
  if (!property) {
    return new Response(JSON.stringify({ message: 'Property not found' }), { status: 404 });
  }

  // Verify ownership
  if (property.ownerId.toString() !== user.id) {
    return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
  }

  // Delete the property
  await Property.deleteOne({ _id: params.propertyId });

  return new Response(JSON.stringify({ message: 'Property deleted successfully' }), { status: 200 });
}
