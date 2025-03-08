import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/components/authOptions"; // Keep your current import path
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    
    console.log("🛠️ Session Data:", session); // Debugging
    
    // Check if user is authenticated
    if (!session || !session.user) {
      console.log("❌ No session found");
      return new Response(
        JSON.stringify({ error: "Unauthorized: You must be logged in to access this resource" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Check for admin role
    if (session.user.role !== "ADMIN") {
      console.log("⛔ Access denied: User role:", session.user.role);
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
    
    console.log("✅ Admin access granted for:", session.user.email);
    
    // Rest of your code remains the same
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 100;
    const skip = (page - 1) * limit;
    
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || "defaultDB";
    const collectionName = process.env.MONGODB_COLLECTION || "defaultCollection";
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    const data = await collection
      .find({}, { projection: { filename: 1, code: 1, _id: 0 } })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
      
    const totalItems = await collection.countDocuments();
    
    // console.log("✅ Data fetched successfully!");
    
    return new Response(
      JSON.stringify({
        data,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("🚨 Error fetching data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}