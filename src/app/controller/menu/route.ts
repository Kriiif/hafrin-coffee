import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Menu, type IMenu } from "@/models/menu";
import { dataApiFind } from "@/lib/mongo-data-api";
import mongoose from "mongoose";

interface LeanMenuDocument extends Omit<IMenu, '_id'> {
  _id: mongoose.Types.ObjectId | string;
}

export async function GET(req: NextRequest) {
  try {
    // If Data API envs are present (Cloudflare Workers), prefer Data API.
    const hasDataApi = Boolean(
      process.env.MONGODB_DATA_API_URL &&
      process.env.MONGODB_DATA_API_KEY &&
      process.env.MONGODB_DATA_SOURCE
    );

    if (hasDataApi) {
      console.log("GET /controller/menu - Using MongoDB Data API");
      const docs = await dataApiFind<LeanMenuDocument>("menus", { filter: {}, limit: 100 });
      const transformedMenus = docs.map(menu => ({
        id: menu._id.toString(),
        title: menu.name,
        description: menu.description || "",
        price: menu.price,
        imageQuery: menu.pic || menu.name.toLowerCase().replace(/\s+/g, "-"),
      }));
      return NextResponse.json({ success: true, menus: transformedMenus });
    }

    // Fallback to direct mongoose (local dev / Node runtime)
    console.log("GET /controller/menu - Connecting to MongoDB via Mongoose...");
    await connectDB();
    const menus = await Menu.find({}).lean() as unknown as LeanMenuDocument[];
    const transformedMenus = menus.map(menu => ({
      id: menu._id.toString(),
      title: menu.name,
      description: menu.description || "",
      price: menu.price,
      imageQuery: menu.pic || menu.name.toLowerCase().replace(/\s+/g, "-"),
    }));
    return NextResponse.json({ success: true, menus: transformedMenus });
  } catch (error) {
    console.error("GET /controller/menu error:", error);
    
    // Return proper JSON error, not HTML
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch menus",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}