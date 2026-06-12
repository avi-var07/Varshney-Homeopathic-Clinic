/**
 * One-time script: upload all local /public/images to Cloudinary
 * Run: node scripts/upload-images.mjs
 *
 * After running, copy the printed URLs into src/lib/cloudinaryImages.ts
 */

import { v2 as cloudinary } from "cloudinary";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Load .env.local manually
const envFile = readFileSync(".env.local", "utf-8");
const env = {};
for (const line of envFile.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const [key, ...rest] = trimmed.split("=");
  if (key) env[key.trim()] = rest.join("=").trim();
}

cloudinary.config({
  cloud_name: env["CLOUDINARY_CLOUD_NAME"],
  api_key:    env["CLOUDINARY_API_KEY"],
  api_secret: env["CLOUDINARY_API_SECRET"],
});

const IMAGES_DIR = "./public/images";
const FOLDER     = "vhc-site"; // Cloudinary folder name

// Allowed image extensions
const ALLOWED = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// Walk directory recursively
function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (ALLOWED.includes(extname(entry).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

async function uploadAll() {
  const files = walkDir(IMAGES_DIR);
  console.log(`\nFound ${files.length} images to upload...\n`);

  const results = {};

  for (const filePath of files) {
    // Build a clean public_id from relative path
    const rel = relative(IMAGES_DIR, filePath)
      .replace(/\\/g, "/")
      .replace(/\.[^.]+$/, "")           // remove extension
      .replace(/[^a-zA-Z0-9/_-]/g, "-") // sanitise special chars
      .replace(/-+/g, "-");              // collapse multiple dashes

    const publicId = `${FOLDER}/${rel}`;

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: false,          // skip if already uploaded
        use_filename: false,
        resource_type: "image",
        quality: "auto:good",
        fetch_format: "auto",
      });
      results[filePath] = result.secure_url;
      console.log(`✓ ${rel}`);
      console.log(`  → ${result.secure_url}\n`);
    } catch (err) {
      console.error(`✗ Failed: ${filePath}`, err.message);
    }
  }

  // Print a summary mapping for cloudinaryImages.ts
  console.log("\n\n========== COPY THIS INTO src/lib/cloudinaryImages.ts ==========\n");
  console.log("export const CLOUD_IMAGES = {");
  for (const [local, url] of Object.entries(results)) {
    const key = relative(IMAGES_DIR, local)
      .replace(/\\/g, "/")
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9/]/g, "_");
    console.log(`  "${key}": "${url}",`);
  }
  console.log("};");
}

uploadAll();
