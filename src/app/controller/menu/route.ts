import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Menu, type IMenu } from "@/models/menu";
import mongoose from "mongoose";

interface LeanMenuDocument extends Omit<IMenu, '_id'> {
  _id: mongoose.Types.ObjectId | string;
}

export async function GET(req: NextRequest) {
  try {
    console.log("GET /controller/menu - Connecting to database...");
    await connectDB();
    console.log("GET /controller/menu - Database connected, fetching menus...");

    const menus = await Menu.find({}).lean() as unknown as LeanMenuDocument[];
    console.log("GET /controller/menu - Found", menus.length, "menus");
    
    const transformedMenus = menus.map(menu => ({
      id: menu._id.toString(),
      title: menu.name,
      description: menu.description || "",
      price: menu.price,
      imageQuery: menu.pic || menu.name.toLowerCase().replace(" ", "-"),
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