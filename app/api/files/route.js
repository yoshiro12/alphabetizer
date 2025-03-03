import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    console.log("🔍 Fetching data...");

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 100;
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db("techzcloud");
    const collection = db.collection("files");

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
