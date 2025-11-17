import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/order";
import { Cart } from "@/models/cart";

// GET: return orders for a given userId (query param: ?userId=...)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    await connectDB();

    // Populate idProduct so the client has name/price/pic
    const orders = await Order.find({ idUser: userId }).populate("items.idProduct").sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST: create a new order. Expect body to include idUser, items (array) and totalAmount.
export async function POST(req: Request) {
  try {
    const body = await req.json() as any;
    console.log("📦 Incoming order data:", body);

    const { idUser, items, totalAmount } = body;

    if (!idUser || !items || !Array.isArray(items) || typeof totalAmount !== "number") {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    await connectDB();

    // Normalize items to store idProduct as ObjectId (or its string)
    const normalizedItems = items.map((it: any) => ({
      idProduct: it.idProduct?._id || it.idProduct,
      quantity: it.quantity,
      sugar: it.sugar,
      ice: it.ice,
      additions: Array.isArray(it.additions) ? it.additions : []
    }));

    const orderDoc = {
      idUser,
      items: normalizedItems,
      totalAmount,
      // start with paymentStatus pending (schema default) and record initial status
      statusHistory: [{ status: "pending", timestamp: new Date() }]
    };

    const newOrder = await Order.create(orderDoc);
    console.log("✅ Order saved:", newOrder);

    // NOTE: Do NOT remove items from cart at order creation time.
    // Cart cleanup will occur only after payment confirmation from Midtrans callback.

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}