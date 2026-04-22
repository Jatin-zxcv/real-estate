"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { extractSession, parseApiError } from "@/components/admin/admin-utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const nextPath = useMemo(() => {
    const requested = searchParams.get("next");
    if (requested && requested.startsWith("/admin")) {
      return requested;
    }

    return "/admin";
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/get-session", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const payload = await response.json().catch(() => null);
        const session = extractSession(payload);

        if (!cancelled && session?.user) {
          router.replace(nextPath);
          router.refresh();
          return;
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    };

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [nextPath, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          callbackURL: nextPath,
          rememberMe: true,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(parseApiError(payload, "Unable to sign in"));
      }

      router.replace(nextPath);
      router.refresh();
    } catch (submitError) {
      setError(submitError?.message || "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-auth-shell">
      <div className="admin-auth-card admin-fade-in">
        <p className="admin-eyebrow">Admin Portal</p>
        <h2>Sign in</h2>
        <p className="admin-muted">Use your admin credentials to manage inventory, inquiries, and content.</p>

        {isChecking ? <p className="admin-message info">Checking active session...</p> : null}
        {error ? <p className="admin-message error">{error}</p> : null}

        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <div className="admin-field span-2">
            <label htmlFor="admin-email">Email</label>
            <input
              className="admin-input"
              id="admin-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@company.com"
              required
              type="email"
              value={email}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="admin-password">Password</label>
            <input
              className="admin-input"
              id="admin-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
              type="password"
              value={password}
            />
          </div>

          <div className="span-2 admin-inline-actions">
            <button className="admin-button" disabled={isSubmitting || isChecking} type="submit">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
            <Link className="admin-button secondary" href="/admin/bootstrap">
              Bootstrap first admin
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
