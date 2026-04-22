"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { extractSession, parseApiError } from "@/components/admin/admin-utils";

export default function AdminLoginPage({ nextPath }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
        <p className="admin-muted">
          Use your admin credentials to manage inventory, inquiries, and content.
        </p>

        {isChecking && (
          <p className="admin-message info">Checking active session...</p>
        )}
        {error && <p className="admin-message error">{error}</p>}

        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <div className="admin-field span-2">
            <label htmlFor="admin-email">Email</label>
            <input
              className="admin-input"
              id="admin-email"
              type="email"
              required
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="admin-password">Password</label>
            <input
              className="admin-input"
              id="admin-password"
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="span-2 admin-inline-actions">
            <button
              className="admin-button"
              type="submit"
              disabled={isSubmitting || isChecking}
            >
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