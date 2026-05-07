import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Uploaded data is not a valid file",
        },
        {
          status: 400,
        }
      );
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Only JPG, PNG, and WEBP images are allowed",
        },
        {
          status: 400,
        }
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: "Image size must be less than 5MB",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, {
      recursive: true,
    });

    const originalName = file.name || "image";
    const extension = extname(originalName) || ".jpg";

    const nameWithoutExtension = originalName.replace(extension, "");

    const safeName =
      nameWithoutExtension
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase() || "image";

    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}-${safeName}${extension}`;

    const filePath = join(uploadDir, filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Error uploading file:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file",
        detail: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
