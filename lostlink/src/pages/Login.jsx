import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(form.email, form.password);
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gray-950 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-400">
            Sign in to your LostLink account
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

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-400">
              Sign Up
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-400">
            <Link to="/forgot-password" className="text-blue-500 hover:text-blue-400">
              Forgot password?
            </Link>
          </p>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center text-sm text-gray-500">
          <p className="font-medium text-gray-400">Demo Credentials</p>
          <p className="mt-1">Admin: admin@lostlink.com / admin123</p>
          <p>User: abebe@example.com / user123</p>
        </div>
      </div>
    </section>
  );
}

export default Login;