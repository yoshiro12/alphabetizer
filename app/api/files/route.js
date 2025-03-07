import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import NextAuth, { AuthOptions } from "next-auth";

export const dynamic = "force-dynamic"; // ✅ Prevents static rendering error

export async function GET(req) {
  try {
    // Get the current session
    const session = await getServerSession(AuthOptions);
    
    // Check if user is authenticated
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: You must be logged in to access this resource" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    console.log("🔍 Fetching data for user:", session.user.email);
    
    // If authenticated, proceed with the data fetching
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
    
    console.log("✅ Data fetched successfully!");
    
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