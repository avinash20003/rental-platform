import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../../lib/jwt';

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ message: 'Missing fields' }), { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });

  const token = signToken({ id: user._id.toString(), role: user.role });

  return new Response(JSON.stringify({ token, id: user._id.toString(), role: user.role }), { status: 200 });
}
