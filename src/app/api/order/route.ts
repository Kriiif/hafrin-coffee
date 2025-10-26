import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/order";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const newOrder = await Order.create(body);

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err) {
    console.error("Error creating order:", err);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}