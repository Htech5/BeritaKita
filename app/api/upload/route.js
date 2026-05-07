import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "File harus berupa JPG, PNG, atau WEBP" },
        { status: 400 }
      );
    }

    const maxSize = 4 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "Ukuran gambar maksimal 4MB" },
        { status: 400 }
      );
    }

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const safeFileName =
      file.name
        ?.replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "")
        .toLowerCase() || "image.jpg";

    const filename = `uploads/${uniqueSuffix}-${safeFileName}`;

    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    console.error("Error uploading file:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file",
        detail: error.message,
      },
      { status: 500 }
    );
  }
}
