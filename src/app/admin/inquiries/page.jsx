"use client";

import { useCallback, useEffect, useState } from "react";

import AdminShell from "@/components/admin/AdminShell";
import { formatDate, requestJSON } from "@/components/admin/admin-utils";

const STATUS_OPTIONS = ["NEW", "CONTACTED", "FOLLOW_UP", "CLOSED", "CONVERTED"];
const SOURCE_OPTIONS = ["CONTACT_FORM", "PROPERTY_DETAIL"];

function InquiriesContent() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    status: "",
    source: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadInquiries = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));

      if (filters.status) params.set("status", filters.status);
      if (filters.source) params.set("source", filters.source);

      const data = await requestJSON(`/api/inquiries?${params.toString()}`);
      setItems(data?.items || []);
      setPagination((current) => ({
        ...current,
        ...(data?.pagination || {}),
      }));
    } catch (requestError) {
      setError(requestError?.message || "Failed to load inquiries");
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const handleStatusUpdate = async (id, status) => {
    if (updatingId) return;

    setUpdatingId(id);
    setError("");
    setMessage("");

    try {
      const updated = await requestJSON(`/api/inquiries/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setItems((current) =>
        current.map((item) => {
          if (item.id !== id) return item;
          return {
            ...item,
            ...updated,
          };
        })
      );

      setMessage("Inquiry status updated.");
    } catch (updateError) {
      setError(updateError?.message || "Failed to update status");
    } finally {
      setUpdatingId("");
    }
  };

  const goToNextPage = () => {
    if (pagination.page >= pagination.totalPages) return;

    setPagination((current) => ({
      ...current,
      page: current.page + 1,
    }));
  };

  const goToPreviousPage = () => {
    if (pagination.page <= 1) return;

    setPagination((current) => ({
      ...current,
      page: current.page - 1,
    }));
  };

  return (
    <div className="admin-grid">
      <section className="admin-panel span-12 admin-fade-in">
        <div className="admin-panel-head">
          <div>
            <h3>Lead inbox</h3>
            <p className="admin-muted">Track inquiry progress and maintain response workflows.</p>
          </div>
          <button className="admin-button secondary" onClick={loadInquiries} type="button">
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="admin-form-grid" style={{ marginBottom: "1rem" }}>
          <div className="admin-field">
            <label htmlFor="inquiry-status-filter">Status</label>
            <select
              className="admin-select"
              id="inquiry-status-filter"
              onChange={(event) => {
                setPagination((current) => ({ ...current, page: 1 }));
                setFilters((current) => ({ ...current, status: event.target.value }));
              }}
              value={filters.status}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label htmlFor="inquiry-source-filter">Source</label>
            <select
              className="admin-select"
              id="inquiry-source-filter"
              onChange={(event) => {
                setPagination((current) => ({ ...current, page: 1 }));
                setFilters((current) => ({ ...current, source: event.target.value }));
              }}
              value={filters.source}
            >
              <option value="">All sources</option>
              {SOURCE_OPTIONS.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? <p className="admin-message error">{error}</p> : null}
        {message ? <p className="admin-message success">{message}</p> : null}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Source</th>
                <th>Status</th>
                <th>Property</th>
                <th>Message</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {items.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>
                    <p>{inquiry.name}</p>
                    <p className="admin-muted">{inquiry.email}</p>
                    <p className="admin-muted">{inquiry.phone}</p>
                  </td>
                  <td>
                    <span className="admin-badge">{inquiry.source}</span>
                  </td>
                  <td>
                    <select
                      className="admin-select"
                      disabled={updatingId === inquiry.id}
                      onChange={(event) => handleStatusUpdate(inquiry.id, event.target.value)}
                      value={inquiry.status}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{inquiry.property?.title || inquiry.propertyReference || "General inquiry"}</td>
                  <td>
                    <p>{inquiry.subject || "No subject"}</p>
                    <p className="admin-muted">{inquiry.message || "No message"}</p>
                  </td>
                  <td>{formatDate(inquiry.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && !isLoading ? (
          <div className="admin-empty">No inquiries match your filters.</div>
        ) : null}

        <div className="admin-pagination">
          <p>
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <button className="admin-button ghost" onClick={goToPreviousPage} type="button">
            Previous
          </button>
          <button className="admin-button ghost" onClick={goToNextPage} type="button">
            Next
          </button>
        </div>
      </section>
    </div>
  );
}

export default function AdminInquiriesPage() {
  return (
    <AdminShell
      description="Review incoming leads, organize statuses, and track conversion progress."
      title="Inquiries"
    >
      <InquiriesContent />
    </AdminShell>
  );
}
