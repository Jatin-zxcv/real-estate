"use client";

import { useState } from "react";
import Link from "next/link";

import { requestJSON } from "@/components/admin/admin-utils";

export default function AdminBootstrapPage() {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const data = await requestJSON("/api/admin/bootstrap", {
        method: "POST",
        headers: {
          "x-bootstrap-token": token.trim(),
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      setSuccess(data?.message || "Bootstrap completed successfully.");
      setPassword("");
    } catch (submitError) {
      setError(submitError?.message || "Bootstrap failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-auth-shell">
      <div className="admin-auth-card admin-fade-in">
        <p className="admin-eyebrow">One-Time Setup</p>
        <h2>Bootstrap super admin</h2>
        <p className="admin-muted">
          Use the secure bootstrap token from server environment to create or promote the first
          super admin account.
        </p>

        {success ? <p className="admin-message success">{success}</p> : null}
        {error ? <p className="admin-message error">{error}</p> : null}

        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <div className="admin-field span-2">
            <label htmlFor="bootstrap-token">Bootstrap token</label>
            <input
              className="admin-input"
              id="bootstrap-token"
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste ADMIN_BOOTSTRAP_TOKEN"
              required
              type="password"
              value={token}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="bootstrap-name">Name</label>
            <input
              className="admin-input"
              id="bootstrap-name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Admin full name"
              required
              type="text"
              value={name}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="bootstrap-email">Email</label>
            <input
              className="admin-input"
              id="bootstrap-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@company.com"
              required
              type="email"
              value={email}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="bootstrap-password">Password</label>
            <input
              className="admin-input"
              id="bootstrap-password"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 8 characters"
              required
              type="password"
              value={password}
            />
          </div>

          <div className="span-2 admin-inline-actions">
            <button className="admin-button" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Running bootstrap..." : "Run bootstrap"}
            </button>
            <Link className="admin-button secondary" href="/admin/login">
              Go to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
