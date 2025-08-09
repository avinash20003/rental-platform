import connectDB from '../../../../../lib/mongodb';
import Property from '../../../../../models/Property';
import { verifyToken } from '../../../../../lib/jwt';

export async function GET(req, { params }) {
  await connectDB();

  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);

  // Check user role and owner match
  if (!user || user.role !== 'owner' || user.id !== params.ownerId) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  // Fetch all properties for the owner
  const properties = await Property.find({ ownerId: params.ownerId });

  // Return all properties including _id (needed for editing/deleting)
  return new Response(JSON.stringify(properties), { status: 200 });
}
