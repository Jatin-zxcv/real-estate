"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
import { formatDate, requestJSON } from "@/components/admin/admin-utils";

const EMPTY_SUMMARY = {
  counts: {
    properties: 0,
    inquiries: 0,
    newInquiries: 0,
    blogPosts: 0,
  },
  recentInquiries: [],
};

function DashboardContent() {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSummary = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await requestJSON("/api/admin/summary");
      setSummary(data || EMPTY_SUMMARY);
    } catch (requestError) {
      setError(requestError?.message || "Failed to load dashboard summary");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const kpiItems = useMemo(
    () => [
      { label: "Properties", value: summary.counts.properties },
      { label: "All inquiries", value: summary.counts.inquiries },
      { label: "New inquiries", value: summary.counts.newInquiries },
      { label: "Blog posts", value: summary.counts.blogPosts },
    ],
    [summary]
  );

  return (
    <div className="admin-grid">
      <section className="admin-panel span-12 admin-fade-in">
        <div className="admin-panel-head">
          <div>
            <h3>Snapshot</h3>
            <p className="admin-muted">Live totals across your admin systems.</p>
          </div>
          <button className="admin-button secondary" onClick={loadSummary} type="button">
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error ? <p className="admin-message error">{error}</p> : null}

        <div className="admin-kpi-grid">
          {kpiItems.map((item) => (
            <article className="admin-kpi" key={item.label}>
              <p className="admin-eyebrow">{item.label}</p>
              <h4>{item.value}</h4>
              <p className="admin-muted">Current records</p>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel span-8 admin-fade-in">
        <div className="admin-panel-head">
          <div>
            <h3>Recent inquiries</h3>
            <p className="admin-muted">Most recent 10 submissions.</p>
          </div>
          <Link className="admin-button secondary" href="/admin/inquiries">
            Open inquiries
          </Link>
        </div>

        {summary.recentInquiries.length === 0 ? (
          <div className="admin-empty">No inquiries yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Property</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentInquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>
                      <p>{inquiry.name}</p>
                      <p className="admin-muted">{inquiry.phone}</p>
                    </td>
                    <td>
                      <span className="admin-badge">{inquiry.source}</span>
                    </td>
                    <td>
                      <span className="admin-badge">{inquiry.status}</span>
                    </td>
                    <td>{inquiry.property?.title || inquiry.propertyReference || "General"}</td>
                    <td>{formatDate(inquiry.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-panel span-4 admin-fade-in">
        <div className="admin-panel-head">
          <div>
            <h3>Quick actions</h3>
            <p className="admin-muted">Jump to frequently used admin tasks.</p>
          </div>
        </div>

        <div className="admin-inline-actions">
          <Link className="admin-button secondary" href="/admin/properties">
            Manage properties
          </Link>
          <Link className="admin-button secondary" href="/admin/inquiries">
            Review inquiries
          </Link>
          <Link className="admin-button secondary" href="/admin/blog">
            Edit blog
          </Link>
          <Link className="admin-button ghost" href="/admin/bootstrap">
            Bootstrap admin
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminShell
      description="Monitor listing operations, leads, and content health from one workspace."
      title="Overview"
    >
      <DashboardContent />
    </AdminShell>
  );
}
