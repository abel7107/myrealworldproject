import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gray-950 px-6">
      <div className="text-center">
        <p className="text-8xl font-bold text-gray-800">404</p>
        <h1 className="mt-4 text-3xl font-bold text-white">Page Not Found</h1>
        <p className="mt-3 text-gray-400">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          ← Back to Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;