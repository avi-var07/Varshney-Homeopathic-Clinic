import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { SAMPLE_BLOGS } from "@/lib/constants";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "9"));

  try {
    await connectDB();
    const query: Record<string, unknown> = { published: true };
    if (category && category !== "All") query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-content");

    const total = await Blog.countDocuments(query);

    return NextResponse.json({
      blogs,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch {
    // Fallback to static blogs if DB not connected
    let filtered = SAMPLE_BLOGS;
    if (category && category !== "All") {
      filtered = filtered.filter((b) => b.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(s) ||
          b.tags.some((t) => t.toLowerCase().includes(s))
      );
    }
    return NextResponse.json({
      blogs: filtered.slice((page - 1) * limit, page * limit),
      pagination: {
        total: filtered.length,
        page,
        pages: Math.ceil(filtered.length / limit),
      },
    });
  }
}

// Protected — admin only
export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const blog = await Blog.create(body);
    return NextResponse.json({ blog }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create blog" }, { status: 500 });
  }
}
