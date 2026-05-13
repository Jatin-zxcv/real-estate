import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";
import { destroyImageByUrl, uploadImageBuffer } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

export async function POST(request) {
  const adminCheck = await requireAdmin(request);
  if (adminCheck.error) return adminCheck.error;

  try {
    const formData = await request.formData();
    const files = formData
      .getAll("images")
      .filter((file) => file instanceof File && file.size > 0);

    if (files.length === 0) {
      return fail("Select at least one image to upload", 400);
    }

    const uploads = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return fail("Only image files can be uploaded", 415);
      }

      if (file.size > MAX_IMAGE_SIZE) {
        return fail("Each image must be 8MB or smaller", 413);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadImageBuffer(buffer, {
        tags: ["admin-upload", "property"],
      });

      uploads.push({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      });
    }

    return ok({ uploads }, 201);
  } catch (error) {
    return fail("Failed to upload image", 500, error?.message);
  }
}

export async function DELETE(request) {
  const adminCheck = await requireAdmin(request);
  if (adminCheck.error) return adminCheck.error;

  try {
    const body = await request.json();
    const urls = Array.isArray(body?.urls) ? body.urls : [body?.url].filter(Boolean);

    if (urls.length === 0) {
      return fail("Select at least one image to remove", 400);
    }

    const results = await Promise.all(urls.map((url) => destroyImageByUrl(url)));

    return ok({ results });
  } catch (error) {
    return fail("Failed to remove image", 500, error?.message);
  }
}
