export function parseApiError(payload, fallback = "Request failed") {
  if (!payload) return fallback;

  if (typeof payload === "string") {
    return payload;
  }

  if (typeof payload.error === "string") {
    return payload.error;
  }

  if (typeof payload.message === "string") {
    return payload.message;
  }

  if (payload.error && typeof payload.error.message === "string") {
    return payload.error.message;
  }

  return fallback;
}

export async function requestJSON(url, options = {}) {
  const config = {
    ...options,
    credentials: "include",
    cache: "no-store",
    headers: {
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, config);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(parseApiError(payload, `Request failed (${response.status})`));
  }

  if (payload && typeof payload === "object" && "success" in payload) {
    if (!payload.success) {
      throw new Error(parseApiError(payload));
    }

    return payload.data;
  }

  return payload;
}

export function extractSession(payload) {
  if (!payload) return null;

  if (payload.session && payload.user) {
    return payload;
  }

  if (payload.data && payload.data.session && payload.data.user) {
    return payload.data;
  }

  return null;
}

export function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatCurrencyINR(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "-";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numeric);
}

export function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const timezoneOffset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - timezoneOffset * 60000);
  return localDate.toISOString().slice(0, 16);
}
