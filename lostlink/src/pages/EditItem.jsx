import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { useItems } from "../context/ItemsContext";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateItem } = useItems();

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .getItem(id)
      .then((body) => {
        if (cancelled) return;
        const item = body.data;
        setForm({
          title: item.title || "",
          type: item.type === "LOST" ? "Lost" : "Found",
          category: item.category?.name || "",
          location: item.location || "",
          description: item.description || "",
          date: item.dateLostOrFound
            ? new Date(item.dateLostOrFound).toISOString().slice(0, 10)
            : "",
          contactName: item.contactName || "",
          contactPhone: item.contactPhone || "",
        });
        if (item.imageUrl) setPreview(item.imageUrl);
      })
      .catch(() => setError("Failed to load item."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (imageFile) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        fd.append("image", imageFile);
        await updateItem(id, fd);
      } else {
        await updateItem(id, form);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to update item.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!form) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-gray-950 px-6">
        <div className="text-center">
          <p className="text-6xl">😕</p>
          <h2 className="mt-6 text-3xl font-bold text-white">Item Not Found</h2>
          <Link to="/dashboard" className="mt-6 inline-block text-blue-500 hover:text-blue-400">
            ← Back to Dashboard
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-8 text-3xl font-bold text-white">Edit Report</h2>
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-800 bg-gray-900 p-8"
        >
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Item Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500" />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Type *</label>
            <div className="flex gap-4">
              <label className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-4 py-3 font-medium transition ${form.type === "Lost" ? "border-red-500 bg-red-500/10 text-red-400" : "border-gray-700 bg-gray-800 text-gray-400"}`}>
                <input type="radio" name="type" value="Lost" checked={form.type === "Lost"} onChange={handleChange} className="sr-only" />
                🔍 Lost
              </label>
              <label className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-4 py-3 font-medium transition ${form.type === "Found" ? "border-green-500 bg-green-500/10 text-green-400" : "border-gray-700 bg-gray-800 text-gray-400"}`}>
                <input type="radio" name="type" value="Found" checked={form.type === "Found"} onChange={handleChange} className="sr-only" />
                🤝 Found
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500">
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Bags">Bags</option>
              <option value="Keys">Keys</option>
              <option value="Documents">Documents</option>
              <option value="Clothing">Clothing</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Location *</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500" />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Date Lost/Found</label>
            <input type="date" name="date" value={form.date} onChange={handleChange}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500" />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4}
              className="w-full resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500" />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Your Name</label>
            <input type="text" name="contactName" value={form.contactName} onChange={handleChange}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500" />
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-300">Phone Number</label>
            <input type="tel" name="contactPhone" value={form.contactPhone} onChange={handleChange}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500" />
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-300">Photo</label>
            {preview && (
              <img src={preview} alt="Preview" className="mb-3 h-40 w-full rounded-xl object-cover" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                setPreview(file ? URL.createObjectURL(file) : preview);
              }}
              className="w-full text-sm text-gray-400 file:mr-4 file:rounded-xl file:border-0 file:bg-gray-800 file:px-4 file:py-2.5 file:text-white hover:file:bg-gray-700"
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={submitting}
              className="flex-1 rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50">
              {submitting ? "Saving..." : "Save Changes"}
            </button>
            <Link to="/dashboard"
              className="rounded-xl border border-gray-700 px-6 py-4 font-semibold text-gray-300 transition hover:bg-gray-800">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default EditItem;
