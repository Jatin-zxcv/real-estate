import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function assertCloudinaryConfigured() {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured.");
  }
}

export function uploadImageBuffer(buffer, options = {}) {
  assertCloudinaryConfigured();

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "sharma-real-estates/properties",
        resource_type: "image",
        overwrite: false,
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    upload.end(buffer);
  });
}

export function getPublicIdFromCloudinaryUrl(url) {
  if (typeof url !== "string" || !url.includes("res.cloudinary.com")) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    const uploadIndex = parsedUrl.pathname.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    const pathAfterUpload = parsedUrl.pathname.slice(uploadIndex + "/upload/".length);
    const segments = pathAfterUpload.split("/").filter(Boolean);
    const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
    const publicIdSegments =
      versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments.slice(1);

    if (publicIdSegments.length === 0) return null;

    const publicIdWithExtension = publicIdSegments.join("/");
    const publicId = publicIdWithExtension.replace(/\.[^.]+$/, "");

    if (!publicId.startsWith("sharma-real-estates/")) {
      return null;
    }

    return decodeURIComponent(publicId);
  } catch {
    return null;
  }
}

export function destroyImageByUrl(url) {
  assertCloudinaryConfigured();

  const publicId = getPublicIdFromCloudinaryUrl(url);
  if (!publicId) {
    return Promise.resolve({ result: "skipped" });
  }

  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
}
