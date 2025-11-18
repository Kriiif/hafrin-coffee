import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { dataApiFindOne, dataApiUpdateOne, toObjectId } from "@/lib/mongo-data-api";

function isHexObjectId(id: string) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}


export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;
    
    console.log("GET /controller/user - Session ID:", sessionId ? "exists" : "missing");
    
    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    // Validate ObjectId format (avoid mongoose in workers)
     if (!isHexObjectId(sessionId)) {
      const resp = NextResponse.json({ success: false, error: "Invalid session format" }, { status: 401 });
      resp.cookies.delete("session");
      return resp;
    }
    const hasDataApi = Boolean(
      process.env.MONGODB_DATA_API_URL &&
      process.env.MONGODB_DATA_API_KEY &&
      process.env.MONGODB_DATA_SOURCE
    );

    if (hasDataApi) {
      console.log("GET /controller/user - Using Data API");
      const doc: any = await dataApiFindOne("users", {
        filter: { _id: toObjectId(sessionId) },
        projection: { password: 0 }
      });

      if (!doc) {
        console.log("GET /controller/user - User not found for session (Data API):", sessionId);
        const resp = NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });
        resp.cookies.delete("session");
        return resp;
      }

      const response = NextResponse.json({
        success: true,
        user: {
          _id: String(doc._id?.$oid || doc._id),
          username: doc.username,
          name: doc.name,
          email: doc.email,
          gender: doc.gender || null,
          picture: doc.picture || null,
          provider: doc.provider || null,
          providerId: doc.providerId || null,
          oauth: Boolean(doc.oauth),
          phone: doc.phone || null,
          address: doc.address || null
        }
      });
      
      // Cache auth check for 5 minutes
      response.headers.set('Cache-Control', 'private, max-age=300, stale-while-revalidate=60');
      return response;
    }

  // Fallback to Mongoose (local dev). Use dynamic imports to avoid bundling in Workers
  const { connectDB } = await import("@/lib/mongodb");
  const { User } = await import("@/models/user");
  await connectDB();
  const userObj: any = await User.findById(sessionId).select("-password").lean();
    if (!userObj) {
      console.log("GET /controller/user - User not found for session:", sessionId);
      const resp = NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });
      resp.cookies.delete("session");
      return resp;
    }
    console.log("GET /controller/user - User found:", userObj.username);
    return NextResponse.json({
      success: true,
      user: {
        _id: String(userObj._id),
        username: userObj.username,
        name: userObj.name,
        email: userObj.email,
        gender: userObj.gender || null,
        picture: userObj.picture || null,
        provider: userObj.provider || null,
        providerId: userObj.providerId || null,
        oauth: Boolean(userObj.oauth),
        phone: userObj.phone || null,
        address: userObj.address || null
      }
    });
  } catch (err) {
    console.error("GET /controller/user error:", err);
    return NextResponse.json({ success: false, error: "Authentication check failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;
    if (!sessionId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const body = await request.json() as any;
  const updates: any = {};
    if (typeof body.name === 'string') updates.name = body.name;
    if (typeof body.username === 'string') updates.username = body.username;
    if (typeof body.phone === 'string') updates.phone = body.phone;
    if (typeof body.address === 'string') updates.address = body.address;
    if (typeof body.picture === 'string') updates.picture = body.picture;
  if (typeof body.gender === 'string' && ['male','female','other'].includes(body.gender)) updates.gender = body.gender;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: "No valid fields to update" }, { status: 400 });
    }
    const hasDataApi = Boolean(
      process.env.MONGODB_DATA_API_URL &&
      process.env.MONGODB_DATA_API_KEY &&
      process.env.MONGODB_DATA_SOURCE
    );

    if (hasDataApi) {
      console.log("PUT /controller/user - Using Data API");
      const filter = { _id: toObjectId(sessionId) };
      const projection = { password: 0 };
      
      // Parallel update and fetch for faster response
      const [_, doc] = await Promise.all([
        dataApiUpdateOne("users", { filter, update: { $set: updates } }),
        dataApiFindOne("users", { filter, projection })
      ]);
      
      if (!doc) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      return NextResponse.json({ success: true, user: {
        _id: String((doc as any)._id?.$oid || (doc as any)._id),
        username: (doc as any).username,
        name: (doc as any).name,
        email: (doc as any).email,
        gender: (doc as any).gender || null,
        picture: (doc as any).picture || null,
        phone: (doc as any).phone || null,
        address: (doc as any).address || null
      }});
    }

  const { connectDB } = await import("@/lib/mongodb");
  const { User } = await import("@/models/user");
  await connectDB();
  const updated = await User.findByIdAndUpdate(sessionId, { $set: updates }, { new: true }).select('-password').lean();
    if (!updated) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    const u: any = updated as any;
    return NextResponse.json({ success: true, user: {
      _id: String(u._id),
      username: u.username,
      name: u.name,
      email: u.email,
      gender: u.gender || null,
      picture: u.picture || null,
      phone: u.phone || null,
      address: u.address || null
    }});
  } catch (err) {
    console.error("PUT /controller/user error:", err);
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as any;
    const username = typeof body?.username === 'string' ? body.username : undefined;
    const password = typeof body?.password === 'string' ? body.password : undefined;

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Username and password are required" }, { status: 400 });
    }
    const hasDataApi = Boolean(
      process.env.MONGODB_DATA_API_URL &&
      process.env.MONGODB_DATA_API_KEY &&
      process.env.MONGODB_DATA_SOURCE
    );

    if (hasDataApi) {
      console.log("POST /controller/user - Using Data API login");
      // Only fetch fields needed for login verification + response
      const doc: any = await dataApiFindOne("users", { 
        filter: { username }, 
        projection: { username: 1, password: 1, name: 1, email: 1, gender: 1, picture: 1, phone: 1, address: 1 }
      });
      
      if (!doc || doc.password !== password) {
        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
      }
      
      const userId = String(doc._id?.$oid || doc._id);
      const response = NextResponse.json({
        success: true,
        user: {
          _id: userId,
          username: doc.username,
          name: doc.name,
          email: doc.email,
          gender: doc.gender || null,
          picture: doc.picture || null,
          phone: doc.phone || null,
          address: doc.address || null
        }
      });
      
      response.cookies.set("session", userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      });
      
      return response;
    }

  const { connectDB } = await import("@/lib/mongodb");
  const { User } = await import("@/models/user");
  await connectDB();
  const userObj: any = await User.findOne({ username }).select("+password").lean();
    if (!userObj || userObj.password !== password) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }
    console.log("POST /controller/user - Login successful for:", username);
    const response = NextResponse.json({
      success: true,
      user: {
        _id: String(userObj._id),
        username: userObj.username,
        name: userObj.name,
        email: userObj.email,
        gender: userObj.gender || null,
        picture: userObj.picture || null,
        phone: userObj.phone || null,
        address: userObj.address || null
      }
    });
    response.cookies.set("session", String(userObj._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    console.log("POST /controller/user - Session cookie set for user:", userObj._id);
    return response;
  } catch (err) {
    console.error("POST /controller/user error:", err);
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const resp = NextResponse.json({ success: true });
    resp.cookies.delete("session");
    return resp;
  } catch (err) {
    console.error("DELETE /controller/user error:", err);
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 });
  }
}