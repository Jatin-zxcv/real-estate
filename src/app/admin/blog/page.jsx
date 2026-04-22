"use client";

import { useCallback, useEffect, useState } from "react";

import AdminShell from "@/components/admin/AdminShell";
import { formatDate, requestJSON, toDateTimeLocal } from "@/components/admin/admin-utils";

const EMPTY_BLOG_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  thumbnail: "",
  author: "Sharma Real Estates",
  category: "",
  readTime: "",
  published: false,
  publishedAt: "",
};

function mapBlogToForm(post) {
  return {
    title: post.title || "",
    slug: post.slug || "",
    excerpt: post.excerpt || "",
    content: post.content || "",
    thumbnail: post.thumbnail || "",
    author: post.author || "Sharma Real Estates",
    category: post.category || "",
    readTime: post.readTime || "",
    published: Boolean(post.published),
    publishedAt: toDateTimeLocal(post.publishedAt),
  };
}

function buildPayload(form) {
  const trimOrUndefined = (value) => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  };

  const payload = {
    title: form.title.trim(),
    slug: trimOrUndefined(form.slug),
    content: form.content.trim(),
    excerpt: trimOrUndefined(form.excerpt),
    thumbnail: trimOrUndefined(form.thumbnail),
    author: trimOrUndefined(form.author),
    category: trimOrUndefined(form.category),
    readTime: trimOrUndefined(form.readTime),
    published: form.published,
  };

  if (form.publishedAt) {
    const date = new Date(form.publishedAt);
    if (!Number.isNaN(date.getTime())) {
      payload.publishedAt = date.toISOString();
    }
  }

  return payload;
}

function BlogContent() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    q: "",
    category: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [mode, setMode] = useState("create");
  const [editingSlug, setEditingSlug] = useState("");
  const [form, setForm] = useState(EMPTY_BLOG_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState("");

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));
      params.set("includeDrafts", "true");

      if (filters.q.trim()) params.set("q", filters.q.trim());
      if (filters.category.trim()) params.set("category", filters.category.trim());

      const data = await requestJSON(`/api/blog?${params.toString()}`);
      setItems(data?.items || []);
      setPagination((current) => ({
        ...current,
        ...(data?.pagination || {}),
      }));
    } catch (requestError) {
      setError(requestError?.message || "Failed to load blog posts");
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const setField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setMode("create");
    setEditingSlug("");
    setForm(EMPTY_BLOG_FORM);
  };

  const startEdit = (post) => {
    setMode("edit");
    setEditingSlug(post.slug);
    setForm(mapBlogToForm(post));
    setMessage("");
    setError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (isSaving) return;

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = buildPayload(form);

      const endpoint = mode === "edit" ? `/api/blog/${editingSlug}` : "/api/blog";
      const method = mode === "edit" ? "PUT" : "POST";

      const saved = await requestJSON(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      if (mode === "edit") {
        setEditingSlug(saved.slug);
      } else {
        setForm(EMPTY_BLOG_FORM);
      }

      setMessage(mode === "edit" ? "Blog post updated." : "Blog post created.");
      await loadPosts();
    } catch (saveError) {
      setError(saveError?.message || "Failed to save blog post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (post) => {
    const confirmed = window.confirm(`Delete post \"${post.title}\"?`);
    if (!confirmed) return;

    setDeletingSlug(post.slug);
    setError("");
    setMessage("");

    try {
      await requestJSON(`/api/blog/${post.slug}`, {
        method: "DELETE",
      });

      if (mode === "edit" && editingSlug === post.slug) {
        resetForm();
      }

      setMessage("Blog post deleted.");
      await loadPosts();
    } catch (deleteError) {
      setError(deleteError?.message || "Failed to delete post");
    } finally {
      setDeletingSlug("");
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
      <section className="admin-panel span-7 admin-fade-in">
        <div className="admin-panel-head">
          <div>
            <h3>Articles</h3>
            <p className="admin-muted">Manage published posts and draft content from one queue.</p>
          </div>
          <button className="admin-button secondary" onClick={loadPosts} type="button">
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="admin-form-grid" style={{ marginBottom: "1rem" }}>
          <div className="admin-field span-2">
            <label htmlFor="blog-search">Search</label>
            <input
              className="admin-input"
              id="blog-search"
              onChange={(event) => {
                setPagination((current) => ({ ...current, page: 1 }));
                setFilters((current) => ({ ...current, q: event.target.value }));
              }}
              placeholder="Search title, excerpt, category"
              type="text"
              value={filters.q}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="blog-category-filter">Category</label>
            <input
              className="admin-input"
              id="blog-category-filter"
              onChange={(event) => {
                setPagination((current) => ({ ...current, page: 1 }));
                setFilters((current) => ({ ...current, category: event.target.value }));
              }}
              placeholder="Optional category filter"
              type="text"
              value={filters.category}
            />
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
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((post) => (
                <tr key={post.id}>
                  <td>
                    <p>{post.title}</p>
                    <p className="admin-muted">/{post.slug}</p>
                  </td>
                  <td>{post.category || "-"}</td>
                  <td>
                    <span className="admin-badge">{post.published ? "PUBLISHED" : "DRAFT"}</span>
                  </td>
                  <td>{formatDate(post.updatedAt)}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="admin-button secondary"
                        onClick={() => startEdit(post)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="admin-button danger"
                        disabled={deletingSlug === post.slug}
                        onClick={() => handleDelete(post)}
                        type="button"
                      >
                        {deletingSlug === post.slug ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && !isLoading ? <div className="admin-empty">No posts found.</div> : null}

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

      <section className="admin-panel span-5 admin-fade-in">
        <div className="admin-panel-head">
          <div>
            <h3>{mode === "edit" ? "Edit article" : "Create article"}</h3>
            <p className="admin-muted">Prepare content, keep drafts, and publish when ready.</p>
          </div>
          {mode === "edit" ? (
            <button className="admin-button ghost" onClick={resetForm} type="button">
              Cancel edit
            </button>
          ) : null}
        </div>

        <form className="admin-form-grid" onSubmit={handleSave}>
          <div className="admin-field span-2">
            <label htmlFor="blog-title">Title</label>
            <input
              className="admin-input"
              id="blog-title"
              onChange={(event) => setField("title", event.target.value)}
              required
              type="text"
              value={form.title}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="blog-slug">Slug (optional)</label>
            <input
              className="admin-input"
              id="blog-slug"
              onChange={(event) => setField("slug", event.target.value)}
              type="text"
              value={form.slug}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="blog-excerpt">Excerpt</label>
            <textarea
              className="admin-textarea"
              id="blog-excerpt"
              onChange={(event) => setField("excerpt", event.target.value)}
              value={form.excerpt}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="blog-content">Content</label>
            <textarea
              className="admin-textarea"
              id="blog-content"
              onChange={(event) => setField("content", event.target.value)}
              required
              style={{ minHeight: "220px" }}
              value={form.content}
            />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="blog-thumbnail">Thumbnail URL</label>
            <input
              className="admin-input"
              id="blog-thumbnail"
              onChange={(event) => setField("thumbnail", event.target.value)}
              type="url"
              value={form.thumbnail}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="blog-author">Author</label>
            <input
              className="admin-input"
              id="blog-author"
              onChange={(event) => setField("author", event.target.value)}
              type="text"
              value={form.author}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="blog-category">Category</label>
            <input
              className="admin-input"
              id="blog-category"
              onChange={(event) => setField("category", event.target.value)}
              type="text"
              value={form.category}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="blog-read-time">Read time</label>
            <input
              className="admin-input"
              id="blog-read-time"
              onChange={(event) => setField("readTime", event.target.value)}
              placeholder="e.g. 4 min read"
              type="text"
              value={form.readTime}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="blog-published-at">Published at</label>
            <input
              className="admin-input"
              id="blog-published-at"
              onChange={(event) => setField("publishedAt", event.target.value)}
              type="datetime-local"
              value={form.publishedAt}
            />
          </div>

          <div className="admin-field span-2">
            <label className="admin-checkbox-row" htmlFor="blog-published">
              <input
                checked={form.published}
                id="blog-published"
                onChange={(event) => setField("published", event.target.checked)}
                type="checkbox"
              />
              Publish immediately
            </label>
          </div>

          <div className="span-2 admin-inline-actions">
            <button className="admin-button" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : mode === "edit" ? "Update article" : "Create article"}
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

export default function AdminBlogPage() {
  return (
    <AdminShell
      description="Create and maintain blog content, including drafts and published posts."
      title="Blog"
    >
      <BlogContent />
    </AdminShell>
  );
}
