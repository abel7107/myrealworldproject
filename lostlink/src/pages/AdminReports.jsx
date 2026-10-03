import { useState, useEffect } from "react";
import { api } from "../api/client";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getReports()
      .then(({ data }) => setReports(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const setStatus = async (id, status) => {
    try {
      const { data } = await api.updateReport(id, status);
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: data.status } : r)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-white">View Reports</h1>
        <p className="mt-1 mb-8 text-gray-400">Review flagged content and reports</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : reports.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900 py-16 text-center text-gray-500">
            No reports yet
          </div>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <div key={report.id} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-medium text-white">
                      {report.item?.title || "Unknown item"} — <span className="text-gray-400">{report.reason}</span>
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Reported by {report.reporter?.name} ({report.reporter?.email}) ·{" "}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    {report.description && (
                      <p className="mt-2 text-sm text-gray-400">{report.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        report.status === "PENDING"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : report.status === "RESOLVED"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {report.status}
                    </span>
                    {report.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => setStatus(report.id, "RESOLVED")}
                          className="rounded-lg bg-green-600/20 px-3 py-1.5 text-xs text-green-400 transition hover:bg-green-600/30"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => setStatus(report.id, "DISMISSED")}
                          className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 transition hover:bg-gray-800"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminReports;
