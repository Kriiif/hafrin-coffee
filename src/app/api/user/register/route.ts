import { NextResponse } from "next/server";
import { dataApiFindOne, dataApiInsertOne } from "@/lib/mongo-data-api";

type RegisterRequest = {
  username: string;
  name: string;
  email: string;
  password: string;
  gender?: "male" | "female" | "other";
  phone?: string;
  address?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as RegisterRequest;
    const { username, name, email, password, gender, phone, address } = body;

    // Validate required fields
    if (!username || !name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prefer Data API for Workers
    const hasDataApi = Boolean(
      process.env.MONGODB_DATA_API_URL &&
      process.env.MONGODB_DATA_API_KEY &&
      process.env.MONGODB_DATA_SOURCE
    );

    if (hasDataApi) {
      const existing = await dataApiFindOne("users", { filter: { $or: [{ username }, { email }] } });
      if (existing) {
        return NextResponse.json(
          { success: false, error: (existing as any).username === username ? "Username already taken" : "Email already registered" },
          { status: 400 }
        );
      }

      const insertRes = await dataApiInsertOne("users", {
        document: {
          username,
          name,
          email,
          password, // TODO: hash in production
          gender: gender || "other",
          phone,
          address,
        }
      });

      return NextResponse.json({
        success: true,
        user: { _id: insertRes.insertedId, username, name, email },
      });
    }

    // Fallback: dynamic import Mongoose for local dev
    const { connectDB } = await import("@/lib/mongodb");
    const { User } = await import("@/models/user");
    await connectDB();
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: existingUser.username === username ? "Username already taken" : "Email already registered" },
        { status: 400 }
      );
    }
    const user = await User.create({ username, name, email, password, gender: gender || "other", phone, address });
    return NextResponse.json({ success: true, user: { _id: user._id, username, name, email } });
  } catch (err) {
    console.error("POST /api/user/register error:", err);
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}