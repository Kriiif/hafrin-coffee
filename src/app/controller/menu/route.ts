import { NextRequest, NextResponse } from "next/server";
import { dataApiFind, fromObjectId } from "@/lib/mongo-data-api";

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
      const docs = await dataApiFind<any>("menus", { 
        filter: {}, 
        limit: 100, 
        projection: { name: 1, price: 1, description: 1, pic: 1 } 
      });
      
      const transformedMenus = docs.map((menu: any) => ({
        id: fromObjectId(menu._id),
        title: menu.name,
        description: menu.description || "",
        price: menu.price,
        imageQuery: menu.pic || menu.name.toLowerCase().replace(/\s+/g, "-"),
      }));
      
      const response = NextResponse.json({ success: true, menus: transformedMenus });
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
      return response;
    }

    // Fallback to Mongoose (local dev)
    console.log("GET /controller/menu - Using Mongoose");
    const { connectDB } = await import("@/lib/mongodb");
    const { Menu } = await import("@/models/menu");
    await connectDB();
    
    const menus = await Menu.find({}, { name: 1, price: 1, description: 1, pic: 1 }).lean();
    const transformedMenus = menus.map((menu: any) => ({
      id: String(menu._id),
      title: menu.name,
      description: menu.description || "",
      price: menu.price,
      imageQuery: menu.pic || menu.name.toLowerCase().replace(/\s+/g, "-"),
    }));
    
    const response = NextResponse.json({ success: true, menus: transformedMenus });
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
    return response;
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