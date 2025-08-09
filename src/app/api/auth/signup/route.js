import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await connectDB();
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password || !role) {
    return new Response(JSON.stringify({ message: 'Missing fields' }), { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: 'Email already registered' }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword, role });
  await user.save();

  return new Response(JSON.stringify({ message: 'User created' }), { status: 201 });
}
