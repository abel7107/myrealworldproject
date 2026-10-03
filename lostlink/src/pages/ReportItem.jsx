import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useItems } from "../context/ItemsContext";

function ReportItem() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useItems();

  const preselectedType = searchParams.get("type") || "lost";

  const [form, setForm] = useState({
    title: "",
    type: preselectedType.charAt(0).toUpperCase() + preselectedType.slice(1),
    category: "",
    location: "",
    description: "",
    contactName: "",
    contactPhone: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await addItem(form);
      setSubmitted(true);
      setTimeout(() => navigate("/items"), 2000);
    } catch (err) {
      setError(err.message || "Failed to submit the report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-gray-950 px-6">
        <div className="text-center">
          <p className="text-6xl">🎉</p>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Item Reported Successfully!
          </h2>
          <p className="mt-3 text-gray-400">
            Redirecting you to the items page...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-500">
            Report
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Report an Item
          </h2>
          <p className="mt-3 text-gray-400">
            Fill out the form below to report a lost or found item.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-800 bg-gray-900 p-8"
        >
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Item Title */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Item Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g., iPhone 13, Black Backpack"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>

          {/* Type */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Type *
            </label>
            <div className="flex gap-4">
              <label
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-4 py-3 font-medium transition ${
                  form.type === "Lost"
                    ? "border-red-500 bg-red-500/10 text-red-400"
                    : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="Lost"
                  checked={form.type === "Lost"}
                  onChange={handleChange}
                  className="sr-only"
                />
                🔍 Lost
              </label>
              <label
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-4 py-3 font-medium transition ${
                  form.type === "Found"
                    ? "border-green-500 bg-green-500/10 text-green-400"
                    : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="Found"
                  checked={form.type === "Found"}
                  onChange={handleChange}
                  className="sr-only"
                />
                🤝 Found
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
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

          {/* Location */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="e.g., Dire Dawa, Addis Ababa"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Provide additional details about the item..."
              className="w-full resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>

          {/* Contact Name */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Your Name *
            </label>
            <input
              type="text"
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>

          {/* Contact Phone */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Phone Number *
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              required
              placeholder="Your phone number"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ReportItem;