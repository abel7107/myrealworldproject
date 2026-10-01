import { useParams, Link, useNavigate } from "react-router-dom";
import { useItems } from "../context/ItemsContext";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItem } = useItems();

  const item = getItem(id);

  if (!item) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-gray-950 px-6">
        <div className="text-center">
          <p className="text-6xl">😕</p>
          <h2 className="mt-6 text-3xl font-bold text-white">Item Not Found</h2>
          <p className="mt-3 text-gray-400">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/items"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            ← Back to Items
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-gray-400 transition hover:text-white"
        >
          ← Go Back
        </button>

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          {/* Image placeholder */}
          <div className="flex h-64 items-center justify-center bg-gray-800 md:h-96">
            <span className="text-8xl">
              {item.type === "Lost" ? "🔍" : "🤝"}
            </span>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">{item.title}</h1>
              <span
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                  item.type === "Lost"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-green-500/10 text-green-400"
                }`}
              >
                {item.type}
              </span>
            </div>

            <div className="mb-6 grid gap-4 border-b border-gray-800 pb-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">📍 Location</p>
                <p className="mt-1 text-white">{item.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">🏷️ Category</p>
                <p className="mt-1 text-white">{item.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">📅 Date Reported</p>
                <p className="mt-1 text-white">{item.date}</p>
              </div>
              {item.contactName && (
                <div>
                  <p className="text-sm text-gray-500">👤 Contact</p>
                  <p className="mt-1 text-white">{item.contactName}</p>
                </div>
              )}
            </div>

            {item.description && (
              <div className="mb-6">
                <p className="mb-2 text-sm text-gray-500">Description</p>
                <p className="leading-relaxed text-gray-300">
                  {item.description}
                </p>
              </div>
            )}

            {item.contactPhone && (
              <div className="rounded-xl border border-gray-700 bg-gray-800 p-4">
                <p className="text-sm text-gray-500">📞 Contact Phone</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {item.contactPhone}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ItemDetail;