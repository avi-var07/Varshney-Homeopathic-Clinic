import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { isAdminAuthenticated } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { approved, featured } = await req.json();
    const review = await Review.findByIdAndUpdate(
      params.id,
      { $set: { ...(approved !== undefined && { approved }), ...(featured !== undefined && { featured }) } },
      { new: true }
    );
    if (!review) return NextResponse.json({ message: "Not found." }, { status: 404 });
    return NextResponse.json({ review });
  } catch {
    return NextResponse.json({ message: "Update failed." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    await Review.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted." });
  } catch {
    return NextResponse.json({ message: "Delete failed." }, { status: 500 });
  }
}
