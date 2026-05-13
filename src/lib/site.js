const FALLBACK_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (explicitSiteUrl) {
    return explicitSiteUrl.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/$/, "")}`;
  }

  return FALLBACK_SITE_URL;
}

export function getAbsoluteUrl(pathname = "/") {
  return new URL(pathname, getSiteUrl()).toString();
}

export function resolveMediaUrl(url, fallbackPath = "/home/hero.jpg") {
  if (typeof url === "string" && /^https?:\/\//i.test(url)) {
    return url;
  }

  if (typeof url === "string" && url.startsWith("/")) {
    return getAbsoluteUrl(url);
  }

  return getAbsoluteUrl(fallbackPath);
}