"use client";

import { useCallback, useEffect, useState } from "react";

import AdminShell from "@/components/admin/AdminShell";
import { formatCurrencyINR, requestJSON } from "@/components/admin/admin-utils";

const CATEGORY_OPTIONS = ["RESIDENTIAL", "COMMERCIAL", "LAND", "RENTAL"];
const STATUS_OPTIONS = ["AVAILABLE", "SOLD", "UNDER_CONSTRUCTION", "RENTED"];

const EMPTY_FORM = {
  title: "",
  slug: "",
  description: "",
  shortDescription: "",
  price: "",
  category: "RESIDENTIAL",
  subcategory: "",
  status: "AVAILABLE",
  address: "",
  city: "Hisar",
  state: "Haryana",
  pincode: "",
  area: "",
  bedrooms: "",
  bathrooms: "",
  amenities: "",
  images: "",
  thumbnail: "",
  featured: false,
};

function listTextFromArray(values) {
  if (!Array.isArray(values) || values.length === 0) return "";
  return values.join("\n");
}

function splitMultiline(value) {
  return value
    .split(/\r?\n|,/) 
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapPropertyToForm(property) {
  return {
    title: property.title || "",
    slug: property.slug || "",
    description: property.description || "",
    shortDescription: property.shortDescription || "",
    price: property.price?.toString() || "",
    category: property.category || "RESIDENTIAL",
    subcategory: property.subcategory || "",
    status: property.status || "AVAILABLE",
    address: property.address || "",
    city: property.city || "Hisar",
    state: property.state || "Haryana",
    pincode: property.pincode || "",
    area: property.area?.toString() || "",
    bedrooms: property.bedrooms?.toString() || "",
    bathrooms: property.bathrooms?.toString() || "",
    amenities: listTextFromArray(property.amenities),
    images: listTextFromArray(property.images),
    thumbnail: property.thumbnail || "",
    featured: Boolean(property.featured),
  };
}

function buildPayload(form) {
  const toNullableInteger = (value) => {
    if (value === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.round(parsed) : null;
  };

  const trimOrUndefined = (value) => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  };

  return {
    title: form.title.trim(),
    slug: trimOrUndefined(form.slug),
    description: form.description.trim(),
    shortDescription: trimOrUndefined(form.shortDescription),
    price: Number(form.price),
    category: form.category,
    subcategory: trimOrUndefined(form.subcategory),
    status: form.status,
    address: form.address.trim(),
    city: trimOrUndefined(form.city) || "Hisar",
    state: trimOrUndefined(form.state) || "Haryana",
    pincode: trimOrUndefined(form.pincode),
    area: Number(form.area),
    bedrooms: toNullableInteger(form.bedrooms),
    bathrooms: toNullableInteger(form.bathrooms),
    amenities: splitMultiline(form.amenities),
    images: splitMultiline(form.images),
    thumbnail: trimOrUndefined(form.thumbnail),
    featured: form.featured,
  };
}

function PropertiesContent() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    status: "",
    featured: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const loadProperties = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));

      if (filters.q.trim()) params.set("q", filters.q.trim());
      if (filters.category) params.set("category", filters.category);
      if (filters.status) params.set("status", filters.status);
      if (filters.featured) params.set("featured", "true");

      const data = await requestJSON(`/api/properties?${params.toString()}`);
      setItems(data?.items || []);
      setPagination((current) => ({
        ...current,
        ...(data?.pagination || {}),
      }));
    } catch (requestError) {
      setError(requestError?.message || "Failed to load properties");
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const setField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setMode("create");
    setEditingId("");
    setForm(EMPTY_FORM);
  };

  const startEdit = (property) => {
    setMode("edit");
    setEditingId(property.id);
    setForm(mapPropertyToForm(property));
    setMessage("");
    setError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (isSaving) return;

    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      const payload = buildPayload(form);

      const endpoint = mode === "edit" ? `/api/properties/${editingId}` : "/api/properties";
      const method = mode === "edit" ? "PUT" : "POST";

      await requestJSON(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      setMessage(mode === "edit" ? "Property updated." : "Property created.");
      if (mode === "create") {
        setForm(EMPTY_FORM);
      }
      await loadProperties();
    } catch (saveError) {
      setError(saveError?.message || "Failed to save property");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (property) => {
    const confirmed = window.confirm(`Delete property \"${property.title}\"?`);
    if (!confirmed) return;

    setError("");
    setMessage("");
    setDeletingId(property.id);

    try {
      await requestJSON(`/api/properties/${property.id}`, {
        method: "DELETE",
      });
      setMessage("Property deleted.");

      if (mode === "edit" && editingId === property.id) {
        resetForm();
      }

      await loadProperties();
    } catch (deleteError) {
      setError(deleteError?.message || "Failed to delete property");
    } finally {
      setDeletingId("");
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
      <section className="admin-panel span-8 admin-fade-in">
        <div className="admin-panel-head">
          <div>
            <h3>Property inventory</h3>
            <p className="admin-muted">Browse, filter, and manage listing records.</p>
          </div>
          <button className="admin-button secondary" onClick={loadProperties} type="button">
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="admin-form-grid" style={{ marginBottom: "1rem" }}>
          <div className="admin-field span-2">
            <label htmlFor="property-search">Search</label>
            <input
              className="admin-input"
              id="property-search"
              onChange={(event) => {
                setPagination((current) => ({ ...current, page: 1 }));
                setFilters((current) => ({ ...current, q: event.target.value }));
              }}
              placeholder="Title, city, or subcategory"
              type="text"
              value={filters.q}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="property-category-filter">Category</label>
            <select
              className="admin-select"
              id="property-category-filter"
              onChange={(event) => {
                setPagination((current) => ({ ...current, page: 1 }));
                setFilters((current) => ({ ...current, category: event.target.value }));
              }}
              value={filters.category}
            >
              <option value="">All</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label htmlFor="property-status-filter">Status</label>
            <select
              className="admin-select"
              id="property-status-filter"
              onChange={(event) => {
                setPagination((current) => ({ ...current, page: 1 }));
                setFilters((current) => ({ ...current, status: event.target.value }));
              }}
              value={filters.status}
            >
              <option value="">All</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field span-2">
            <label className="admin-checkbox-row" htmlFor="property-featured-filter">
              <input
                checked={filters.featured}
                id="property-featured-filter"
                onChange={(event) => {
                  setPagination((current) => ({ ...current, page: 1 }));
                  setFilters((current) => ({ ...current, featured: event.target.checked }));
                }}
                type="checkbox"
              />
              Featured only
            </label>
          </div>
        </div>

        {error ? <p className="admin-message error">{error}</p> : null}
        {message ? <p className="admin-message success">{message}</p> : null}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Price</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((property) => (
                <tr key={property.id}>
                  <td>
                    <p>{property.title}</p>
                    <p className="admin-muted">/{property.slug}</p>
                  </td>
                  <td>
                    <span className="admin-badge">{property.category}</span>
                  </td>
                  <td>
                    <span className="admin-badge">{property.status}</span>
                  </td>
                  <td>{formatCurrencyINR(property.price)}</td>
                  <td>
                    {property.city}, {property.state}
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="admin-button secondary"
                        onClick={() => startEdit(property)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="admin-button danger"
                        disabled={deletingId === property.id}
                        onClick={() => handleDelete(property)}
                        type="button"
                      >
                        {deletingId === property.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && !isLoading ? <div className="admin-empty">No properties found.</div> : null}

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

      <section className="admin-panel span-4 admin-fade-in">
        <div className="admin-panel-head">
          <div>
            <h3>{mode === "edit" ? "Edit property" : "Create property"}</h3>
            <p className="admin-muted">
              {mode === "edit"
                ? "Update listing details and media."
                : "Add a new listing to the public catalog."}
            </p>
          </div>
          {mode === "edit" ? (
            <button className="admin-button ghost" onClick={resetForm} type="button">
              Cancel edit
            </button>
          ) : null}
        </div>

        <form className="admin-form-grid" onSubmit={handleSave}>
          <div className="admin-field span-2">
            <label htmlFor="property-title">Title</label>
            <input
              className="admin-input"
              id="property-title"
              onChange={(event) => setField("title", event.target.value)}
              required
              type="text"
              value={form.title}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="property-slug">Slug (optional)</label>
            <input
              className="admin-input"
              id="property-slug"
              onChange={(event) => setField("slug", event.target.value)}
              type="text"
              value={form.slug}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="property-price">Price</label>
            <input
              className="admin-input"
              id="property-price"
              min="1"
              onChange={(event) => setField("price", event.target.value)}
              required
              step="0.01"
              type="number"
              value={form.price}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="property-area">Area (sq.ft)</label>
            <input
              className="admin-input"
              id="property-area"
              min="1"
              onChange={(event) => setField("area", event.target.value)}
              required
              step="0.01"
              type="number"
              value={form.area}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="property-category">Category</label>
            <select
              className="admin-select"
              id="property-category"
              onChange={(event) => setField("category", event.target.value)}
              value={form.category}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label htmlFor="property-status">Status</label>
            <select
              className="admin-select"
              id="property-status"
              onChange={(event) => setField("status", event.target.value)}
              value={form.status}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field span-2">
            <label htmlFor="property-subcategory">Subcategory</label>
            <input
              className="admin-input"
              id="property-subcategory"
              onChange={(event) => setField("subcategory", event.target.value)}
              type="text"
              value={form.subcategory}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="property-address">Address</label>
            <input
              className="admin-input"
              id="property-address"
              onChange={(event) => setField("address", event.target.value)}
              required
              type="text"
              value={form.address}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="property-city">City</label>
            <input
              className="admin-input"
              id="property-city"
              onChange={(event) => setField("city", event.target.value)}
              required
              type="text"
              value={form.city}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="property-state">State</label>
            <input
              className="admin-input"
              id="property-state"
              onChange={(event) => setField("state", event.target.value)}
              required
              type="text"
              value={form.state}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="property-pincode">Pincode</label>
            <input
              className="admin-input"
              id="property-pincode"
              onChange={(event) => setField("pincode", event.target.value)}
              type="text"
              value={form.pincode}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="property-bedrooms">Bedrooms</label>
            <input
              className="admin-input"
              id="property-bedrooms"
              min="0"
              onChange={(event) => setField("bedrooms", event.target.value)}
              type="number"
              value={form.bedrooms}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="property-bathrooms">Bathrooms</label>
            <input
              className="admin-input"
              id="property-bathrooms"
              min="0"
              onChange={(event) => setField("bathrooms", event.target.value)}
              type="number"
              value={form.bathrooms}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="property-short-description">Short description</label>
            <textarea
              className="admin-textarea"
              id="property-short-description"
              onChange={(event) => setField("shortDescription", event.target.value)}
              value={form.shortDescription}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="property-description">Description</label>
            <textarea
              className="admin-textarea"
              id="property-description"
              onChange={(event) => setField("description", event.target.value)}
              required
              value={form.description}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="property-amenities">Amenities (comma or new line separated)</label>
            <textarea
              className="admin-textarea"
              id="property-amenities"
              onChange={(event) => setField("amenities", event.target.value)}
              value={form.amenities}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="property-images">Image URLs (comma or new line separated)</label>
            <textarea
              className="admin-textarea"
              id="property-images"
              onChange={(event) => setField("images", event.target.value)}
              value={form.images}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="property-thumbnail">Thumbnail URL (optional)</label>
            <input
              className="admin-input"
              id="property-thumbnail"
              onChange={(event) => setField("thumbnail", event.target.value)}
              type="url"
              value={form.thumbnail}
            />
          </div>

          <div className="admin-field span-2">
            <label className="admin-checkbox-row" htmlFor="property-featured">
              <input
                checked={form.featured}
                id="property-featured"
                onChange={(event) => setField("featured", event.target.checked)}
                type="checkbox"
              />
              Mark as featured
            </label>
          </div>

          <div className="span-2 admin-inline-actions">
            <button className="admin-button" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : mode === "edit" ? "Update property" : "Create property"}
            </button>
            {mode === "edit" ? (
              <button className="admin-button secondary" onClick={resetForm} type="button">
                Reset form
              </button>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}

export default function AdminPropertiesPage() {
  return (
    <AdminShell
      description="Manage property inventory across residential, commercial, land, and rentals."
      title="Properties"
    >
      <PropertiesContent />
    </AdminShell>
  );
}
