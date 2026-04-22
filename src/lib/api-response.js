import { NextResponse } from "next/server";

export function ok(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(message, status = 400, details = undefined) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
    },
    { status }
  );
}

export function getPagination(searchParams, defaults = {}) {
  const defaultPage = defaults.defaultPage ?? 1;
  const defaultLimit = defaults.defaultLimit ?? 12;
  const maxLimit = defaults.maxLimit ?? 50;

  const pageRaw = Number(searchParams.get("page") || defaultPage);
  const limitRaw = Number(searchParams.get("limit") || defaultLimit);

  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : defaultPage;
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0
      ? Math.min(Math.floor(limitRaw), maxLimit)
      : defaultLimit;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}
