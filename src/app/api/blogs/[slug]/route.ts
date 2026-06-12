import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const blog = await Blog.findOne({ slug: params.slug, published: true });
    if (!blog) return NextResponse.json({ message: "Blog not found." }, { status: 404 });
    // Increment views (fire-and-forget)
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).catch(() => {});
    return NextResponse.json({ blog });
  } catch {
    return NextResponse.json({ message: "Failed." }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await req.json();
    const blog = await Blog.findOneAndUpdate(
      { slug: params.slug },
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!blog) return NextResponse.json({ message: "Blog not found." }, { status: 404 });
    return NextResponse.json({ blog });
  } catch {
    return NextResponse.json({ message: "Update failed." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    await Blog.findOneAndDelete({ slug: params.slug });
    return NextResponse.json({ message: "Deleted." });
  } catch {
    return NextResponse.json({ message: "Delete failed." }, { status: 500 });
  }
}
