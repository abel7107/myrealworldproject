import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    token: searchParams.get("token") || "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword(form.token, form.password);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gray-950 px-6">
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-bold text-white">Choose a New Password</h1>
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-8"
        >
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-300">Reset Token</label>
            <input
              required
              value={form.token}
              onChange={(e) => setForm((p) => ({ ...p, token: e.target.value }))}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-300">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Confirm Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.confirm}
              onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          <p className="mt-6 text-center text-sm text-gray-400">
            <Link to="/login" className="text-blue-500 hover:text-blue-400">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default ResetPassword;
