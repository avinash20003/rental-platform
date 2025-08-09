import connectDB from '../../../../lib/mongodb';
import Property from '../../../../models/Property';
import { verifyToken } from '../../../../lib/jwt';

export async function POST(req) {
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

  const data = await req.json();

  const {
    title,
    description,
    address,
    rentPerMonth,
    amenities,
    propertyType,
    availabilityStart,
    availabilityEnd,
    images,
  } = data;

  const newProp = new Property({
    ownerId: user.id,
    title,
    description,
    address,
    rentPerMonth,
    amenities,
    propertyType,
    availabilityStart: availabilityStart ? new Date(availabilityStart) : null,
    availabilityEnd: availabilityEnd ? new Date(availabilityEnd) : null,
    images,
  });

  await newProp.save();

  return new Response(JSON.stringify(newProp), { status: 201 });
}
