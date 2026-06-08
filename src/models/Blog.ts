import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  published: boolean;
  featuredImage?: string;
  readTime?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    tags: [{ type: String, trim: true }],
    author: {
      type: String,
      default: "Dr. Aman Varshney",
    },
    published: {
      type: Boolean,
      default: false,
    },
    featuredImage: {
      type: String,
    },
    readTime: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
BlogSchema.index({ slug: 1 });
BlogSchema.index({ category: 1, published: 1 });
BlogSchema.index({ tags: 1 });

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
