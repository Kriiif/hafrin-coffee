import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dataApiFindOne, dataApiFind, dataApiInsertOne, dataApiUpdateOne, dataApiDeleteOne, toObjectId, fromObjectId } from "@/lib/mongo-data-api";

function isHexObjectId(id?: string | null) {
	return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
}

// Hydrate cart with menu details from a separate fetch
async function hydrateCartWithMenus(cartDoc: any) {
	if (!cartDoc || !cartDoc.items || cartDoc.items.length === 0) {
		return cartDoc;
	}

	// Get unique menu IDs (ensure they are typed as strings)
	const menuIds: string[] = [...new Set<string>(cartDoc.items.map((item: any) => String(fromObjectId(item.idProduct))))];

	// Fetch all menus in one call
	const menus = await dataApiFind("menus", {
		filter: { _id: { $in: menuIds.map((id: string) => toObjectId(id)) } },
		projection: { name: 1, price: 1, pic: 1 }
	});

	// Create a map for fast lookup
	const menuMap = new Map();
	menus.forEach((menu: any) => {
		menuMap.set(fromObjectId(menu._id), menu);
	});

	// Hydrate items
	cartDoc.items = cartDoc.items.map((item: any) => {
		const menuId = fromObjectId(item.idProduct);
		const menu = menuMap.get(menuId);
		return {
			...item,
			idProduct: menu ? {
				_id: menuId,
				name: menu.name,
				price: menu.price,
				pic: menu.pic
			} : { _id: menuId, name: "Unknown", price: 0, pic: "" }
		};
	});

	return cartDoc;
}

export async function GET(req: Request) {
	try {
		const cookieStore = await cookies();
		const sessionId = cookieStore.get("session")?.value;

		if (!sessionId || !isHexObjectId(sessionId)) {
			return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
		}

		const url = new URL(req.url);
		const idUser = url.searchParams.get("idUser");

		if (!isHexObjectId(idUser)) {
			return NextResponse.json({ success: false, error: "Invalid or missing idUser" }, { status: 400 });
		}

		const hasDataApi = Boolean(
			process.env.MONGODB_DATA_API_URL &&
			process.env.MONGODB_DATA_API_KEY &&
			process.env.MONGODB_DATA_SOURCE
		);

		if (hasDataApi) {
			let cartDoc: any = await dataApiFindOne("carts", { filter: { idUser: toObjectId(idUser!) } });

			if (cartDoc) {
				cartDoc = await hydrateCartWithMenus(cartDoc);
			}

			return NextResponse.json({ success: true, cart: cartDoc });
		}

		// Fallback to Mongoose
		const { connectDB } = await import("@/lib/mongodb");
		const { Cart } = await import("@/models/cart");
		await connectDB();

		let cart = await Cart.findOne({ idUser }).populate({
			path: 'items.idProduct',
			model: 'Menu',
			select: 'name price pic'
		});

		return NextResponse.json({ success: true, cart });
	} catch (err) {
		console.error("GET /controller/cart error:", err);
		return NextResponse.json({ success: false, error: "Failed to fetch cart" }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as any;
		const { idUser, idProduct, quantity, customizations } = body;

		if (!isHexObjectId(idUser) || !isHexObjectId(idProduct) || typeof quantity !== "number") {
			return NextResponse.json({ success: false, error: "Invalid input (idUser, idProduct, quantity required)" }, { status: 400 });
		}

		if (!customizations || typeof customizations !== "object") {
			return NextResponse.json({ success: false, error: "Invalid customizations" }, { status: 400 });
		}

		const hasDataApi = Boolean(
			process.env.MONGODB_DATA_API_URL &&
			process.env.MONGODB_DATA_API_KEY &&
			process.env.MONGODB_DATA_SOURCE
		);

		if (hasDataApi) {
			let cartDoc: any = await dataApiFindOne("carts", { filter: { idUser: toObjectId(idUser) } });

			if (!cartDoc) {
				// Create new cart
				const newCart = {
					idUser: toObjectId(idUser),
					items: [{
						idProduct: toObjectId(idProduct),
						quantity,
						sugar: customizations.sugar,
						ice: customizations.ice,
						additions: customizations.additions || []
					}]
				};

				await dataApiInsertOne("carts", { document: newCart });
				cartDoc = await dataApiFindOne("carts", { filter: { idUser: toObjectId(idUser) } });
				cartDoc = await hydrateCartWithMenus(cartDoc);
				return NextResponse.json({ success: true, cart: cartDoc }, { status: 201 });
			}

			// Check if menu exists
			const menuExists = await dataApiFindOne("menus", { filter: { _id: toObjectId(idProduct) }, projection: { _id: 1 } });
			if (!menuExists) {
				return NextResponse.json({ success: false, error: "Menu item not found" }, { status: 404 });
			}

			// Find existing item with same customizations
			const items = cartDoc.items || [];
			let existingIndex = -1;

			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const itemProductId = fromObjectId(item.idProduct);

				if (itemProductId === idProduct &&
					item.sugar === customizations.sugar &&
					item.ice === customizations.ice) {

					const itemAdditions = item.additions || [];
					const newAdditions = customizations.additions || [];

					if (itemAdditions.length === newAdditions.length) {
						const sortedItemAdditions = [...itemAdditions].sort();
						const sortedNewAdditions = [...newAdditions].sort();

						if (sortedItemAdditions.every((addition: string, index: number) => addition === sortedNewAdditions[index])) {
							existingIndex = i;
							break;
						}
					}
				}
			}

			if (existingIndex >= 0) {
				items[existingIndex].quantity += quantity;
			} else {
				items.push({
					idProduct: toObjectId(idProduct),
					quantity,
					sugar: customizations.sugar,
					ice: customizations.ice,
					additions: customizations.additions || []
				});
			}

			await dataApiUpdateOne("carts", {
				filter: { idUser: toObjectId(idUser) },
				update: { $set: { items } }
			});

			cartDoc = await dataApiFindOne("carts", { filter: { idUser: toObjectId(idUser) } });
			cartDoc = await hydrateCartWithMenus(cartDoc);
			return NextResponse.json({ success: true, cart: cartDoc });
		}

		// Fallback to Mongoose
		const { connectDB } = await import("@/lib/mongodb");
		const { Cart } = await import("@/models/cart");
		const { Menu } = await import("@/models/menu");
		await connectDB();

		let cart = await Cart.findOne({ idUser });

		if (!cart) {
			cart = await Cart.create({
				idUser,
				items: [{
					idProduct,
					quantity,
					sugar: customizations.sugar,
					ice: customizations.ice,
					additions: customizations.additions || []
				}]
			});
			return NextResponse.json({ success: true, cart }, { status: 201 });
		}

		const menuExists = await Menu.exists({ _id: idProduct });
		if (!menuExists) {
			return NextResponse.json({ success: false, error: "Menu item not found" }, { status: 404 });
		}

		const existing = cart.items.find((it: any) => {
			const basicMatch = String(it.idProduct) === String(idProduct) &&
				it.sugar === customizations.sugar &&
				it.ice === customizations.ice;

			if (!basicMatch) return false;

			const itemAdditions = it.additions || [];
			const newAdditions = customizations.additions || [];

			if (itemAdditions.length !== newAdditions.length) return false;

			const sortedItemAdditions = [...itemAdditions].sort();
			const sortedNewAdditions = [...newAdditions].sort();

			return sortedItemAdditions.every((addition, index) => addition === sortedNewAdditions[index]);
		});

		if (existing) {
			existing.quantity = (existing.quantity || 0) + quantity;
		} else {
			cart.items.push({
				idProduct,
				quantity,
				sugar: customizations.sugar,
				ice: customizations.ice,
				additions: customizations.additions || []
			});
		}

		await cart.save();

		cart = await Cart.findOne({ _id: cart._id }).populate({
			path: 'items.idProduct',
			model: 'Menu',
			select: 'name price pic'
		});

		return NextResponse.json({ success: true, cart });
	} catch (err) {
		console.error("POST /controller/cart error:", err);
		return NextResponse.json({ success: false, error: "Failed to add to cart" }, { status: 500 });
	}
}

export async function PUT(req: Request) {
	try {
		const body = (await req.json()) as any;
		const { idUser, idProduct, quantity, customizations } = body;

		if (!isHexObjectId(idUser) || !isHexObjectId(idProduct) || typeof quantity !== "number") {
			return NextResponse.json({ success: false, error: "Invalid input (idUser, idProduct, quantity required)" }, { status: 400 });
		}

		const hasDataApi = Boolean(
			process.env.MONGODB_DATA_API_URL &&
			process.env.MONGODB_DATA_API_KEY &&
			process.env.MONGODB_DATA_SOURCE
		);

		if (hasDataApi) {
			let cartDoc: any = await dataApiFindOne("carts", { filter: { idUser: toObjectId(idUser) } });
			if (!cartDoc) return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 });

			const { sugar, ice, additions } = customizations || {};
			const items = cartDoc.items || [];
			let matchedIndex = -1;

			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const itemProductId = fromObjectId(item.idProduct);

				if (itemProductId === idProduct &&
					item.sugar === sugar &&
					item.ice === ice) {

					const itemAdditions = item.additions || [];
					const updateAdditions = additions || [];

					if (itemAdditions.length === updateAdditions.length) {
						const sortedItemAdditions = [...itemAdditions].sort();
						const sortedUpdateAdditions = [...updateAdditions].sort();

						if (sortedItemAdditions.every((addition: string, index: number) => addition === sortedUpdateAdditions[index])) {
							matchedIndex = i;
							break;
						}
					}
				}
			}

			if (matchedIndex === -1) {
				return NextResponse.json({ success: false, error: "Item not found in cart" }, { status: 404 });
			}

			if (quantity <= 0) {
				items.splice(matchedIndex, 1);
			} else {
				items[matchedIndex].quantity = quantity;
			}

			await dataApiUpdateOne("carts", {
				filter: { idUser: toObjectId(idUser) },
				update: { $set: { items } }
			});

			cartDoc = await dataApiFindOne("carts", { filter: { idUser: toObjectId(idUser) } });
			cartDoc = await hydrateCartWithMenus(cartDoc);
			return NextResponse.json({ success: true, cart: cartDoc });
		}

		// Fallback to Mongoose
		const { connectDB } = await import("@/lib/mongodb");
		const { Cart } = await import("@/models/cart");
		await connectDB();

		let cart = await Cart.findOne({ idUser });
		if (!cart) return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 });

		const { sugar, ice, additions } = body.customizations || {};

		const idx = cart.items.findIndex((it: any) => {
			const basicMatch = String(it.idProduct) === String(idProduct) &&
				it.sugar === sugar &&
				it.ice === ice;

			if (!basicMatch) return false;

			const itemAdditions = it.additions || [];
			const updateAdditions = additions || [];

			if (itemAdditions.length !== updateAdditions.length) return false;

			const sortedItemAdditions = [...itemAdditions].sort();
			const sortedUpdateAdditions = [...updateAdditions].sort();

			return sortedItemAdditions.every((addition, index) => addition === sortedUpdateAdditions[index]);
		});

		if (idx === -1) return NextResponse.json({ success: false, error: "Item not found in cart" }, { status: 404 });

		if (quantity <= 0) {
			cart.items.splice(idx, 1);
		} else {
			cart.items[idx].quantity = quantity;
		}

		await cart.save();

		cart = await Cart.findOne({ _id: cart._id }).populate({
			path: 'items.idProduct',
			model: 'Menu',
			select: 'name price pic'
		});

		return NextResponse.json({ success: true, cart });
	} catch (err) {
		console.error("PUT /controller/cart error:", err);
		return NextResponse.json({ success: false, error: "Failed to update cart" }, { status: 500 });
	}
}

export async function DELETE(req: Request) {
	try {
		const body = (await req.json().catch(() => ({}))) as any;
		const { idUser, idProduct, deleteCart, customizations } = body;

		if (!isHexObjectId(idUser)) {
			return NextResponse.json({ success: false, error: "Invalid or missing idUser" }, { status: 400 });
		}

		const hasDataApi = Boolean(
			process.env.MONGODB_DATA_API_URL &&
			process.env.MONGODB_DATA_API_KEY &&
			process.env.MONGODB_DATA_SOURCE
		);

		if (hasDataApi) {
			if (deleteCart) {
				await dataApiDeleteOne("carts", { filter: { idUser: toObjectId(idUser) } });
				return NextResponse.json({ success: true, message: "Cart deleted" });
			}

			if (!isHexObjectId(idProduct)) {
				return NextResponse.json({ success: false, error: "Invalid or missing idProduct" }, { status: 400 });
			}

			let cartDoc: any = await dataApiFindOne("carts", { filter: { idUser: toObjectId(idUser) } });
			if (!cartDoc) return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 });

			const { sugar, ice, additions } = customizations || {};
			let items = cartDoc.items || [];

			if (Object.keys(customizations || {}).length > 0) {
				// Remove specific item with matching customizations
				items = items.filter((item: any) => {
					const itemProductId = fromObjectId(item.idProduct);

					if (itemProductId !== idProduct || item.sugar !== sugar || item.ice !== ice) {
						return true;
					}

					const itemAdditions = item.additions || [];
					const deleteAdditions = additions || [];

					if (itemAdditions.length !== deleteAdditions.length) return true;

					const sortedItemAdditions = [...itemAdditions].sort();
					const sortedDeleteAdditions = [...deleteAdditions].sort();

					return !sortedItemAdditions.every((addition: string, index: number) => addition === sortedDeleteAdditions[index]);
				});
			} else {
				// Legacy: remove all items with matching product ID
				items = items.filter((item: any) => fromObjectId(item.idProduct) !== idProduct);
			}

			await dataApiUpdateOne("carts", {
				filter: { idUser: toObjectId(idUser) },
				update: { $set: { items } }
			});

			cartDoc = await dataApiFindOne("carts", { filter: { idUser: toObjectId(idUser) } });
			cartDoc = await hydrateCartWithMenus(cartDoc);
			return NextResponse.json({ success: true, cart: cartDoc });
		}

		// Fallback to Mongoose
		const { connectDB } = await import("@/lib/mongodb");
		const { Cart } = await import("@/models/cart");
		await connectDB();

		if (deleteCart) {
			await Cart.deleteOne({ idUser });
			return NextResponse.json({ success: true, message: "Cart deleted" });
		}

		if (!isHexObjectId(idProduct)) {
			return NextResponse.json({ success: false, error: "Invalid or missing idProduct" }, { status: 400 });
		}

		let cart = await Cart.findOne({ idUser });
		if (!cart) return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 });

		const { sugar, ice, additions } = customizations || {};

		if (Object.keys(customizations || {}).length > 0) {
			cart.items = cart.items.filter((it: any) => {
				const basicMatch = String(it.idProduct) !== String(idProduct) ||
					it.sugar !== sugar ||
					it.ice !== ice;

				if (basicMatch) return true;

				const itemAdditions = it.additions || [];
				const deleteAdditions = additions || [];

				if (itemAdditions.length !== deleteAdditions.length) return true;

				const sortedItemAdditions = [...itemAdditions].sort();
				const sortedDeleteAdditions = [...deleteAdditions].sort();

				return !sortedItemAdditions.every((addition, index) => addition === sortedDeleteAdditions[index]);
			});
		} else {
			cart.items = cart.items.filter((it: any) => String(it.idProduct) !== String(idProduct));
		}

		await cart.save();

		cart = await Cart.findOne({ _id: cart._id }).populate({
			path: 'items.idProduct',
			model: 'Menu',
			select: 'name price pic'
		});

		return NextResponse.json({ success: true, cart });
	} catch (err) {
		console.error("DELETE /controller/cart error:", err);
		return NextResponse.json({ success: false, error: "Failed to delete from cart" }, { status: 500 });
	}
}
