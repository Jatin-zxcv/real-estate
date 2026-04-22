"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { extractSession, parseApiError } from "@/components/admin/admin-utils";

const AdminSessionContext = createContext({
  session: null,
  role: null,
});

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/bootstrap", label: "Bootstrap" },
];

export function useAdminSession() {
  return useContext(AdminSessionContext);
}

export default function AdminShell({
  title,
  description,
  children,
  requireSuperAdmin = false,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const checkSession = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/get-session", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(parseApiError(payload, "Unable to validate session"));
      }

      const normalized = extractSession(payload);
      setSession(normalized);

      if (!normalized) {
        const nextPath = pathname || "/admin";
        router.replace(`/admin/login?next=${encodeURIComponent(nextPath)}`);
      }
    } catch (requestError) {
      setError(requestError?.message || "Unable to validate session");
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const activeRole = session?.user?.role || null;
  const requiresSuperAdminButMissing =
    requireSuperAdmin && activeRole && activeRole !== "SUPER_ADMIN";

  const contextValue = useMemo(
    () => ({
      session,
      role: activeRole,
    }),
    [session, activeRole]
  );

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setIsSigningOut(false);
      router.replace("/admin/login");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="admin-auth-shell">
        <div className="admin-auth-card admin-fade-in">
          <p className="admin-eyebrow">Admin Portal</p>
          <h2>Validating access</h2>
          <p className="admin-muted">Preparing your workspace.</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="admin-auth-shell">
        <div className="admin-auth-card admin-fade-in">
          <p className="admin-eyebrow">Admin Portal</p>
          <h2>Redirecting to login</h2>
          {error ? <p className="admin-message error">{error}</p> : null}
        </div>
      </div>
    );
  }

  if (requiresSuperAdminButMissing) {
    return (
      <div className="admin-auth-shell">
        <div className="admin-auth-card admin-fade-in">
          <p className="admin-eyebrow">Restricted</p>
          <h2>Super admin role required</h2>
          <p className="admin-muted">
            Your account is signed in but does not have permission to open this panel.
          </p>
          <div className="admin-inline-actions">
            <Link className="admin-button secondary" href="/admin">
              Back to overview
            </Link>
            <button className="admin-button ghost" onClick={handleSignOut} type="button">
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminSessionContext.Provider value={contextValue}>
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand admin-fade-in">
            <p className="admin-eyebrow">Sharma Real Estates</p>
            <h1>Admin</h1>
          </div>

          <nav className="admin-nav">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(`${item.href}/`));

              return (
                <Link
                  className={`admin-nav-link ${isActive ? "active" : ""}`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="admin-side-footer">
            <p className="admin-muted">Role: {activeRole}</p>
            <p className="admin-muted">{session.user?.email}</p>
            <Link className="admin-link" href="/" target="_blank">
              Open public site
            </Link>
            <button className="admin-button ghost" onClick={handleSignOut} type="button">
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <header className="admin-header admin-fade-in">
            <div>
              <p className="admin-eyebrow">Control Room</p>
              <h2>{title}</h2>
              {description ? <p className="admin-muted">{description}</p> : null}
            </div>
          </header>

          {children}
        </main>
      </div>
    </AdminSessionContext.Provider>
  );
}
