import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

function ItemCard({ id, title, type, category, location, date, imageUrl }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition hover:border-gray-700">
      {/* Image */}
      <div className="relative flex h-48 items-center justify-center bg-gray-800">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <span className="text-5xl">
            {type === "Lost" ? "🔍" : "🤝"}
          </span>
        )}
        <button
          onClick={async (e) => {
            e.preventDefault();
            try { await api.toggleFavorite(id); setSaved((v) => !v); } catch { /* not logged in */ }
          }}
          className="absolute right-3 top-3 rounded-full bg-gray-900/70 px-2 py-1 text-lg backdrop-blur transition hover:scale-110"
          title="Save to watchlist"
        >
          {saved ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <span
            className={`rounded-full px-3 py-1 text-sm ${
              type === "Lost"
                ? "bg-red-500/10 text-red-400"
                : "bg-green-500/10 text-green-400"
            }`}
          >
            {type}
          </span>
        </div>

        <p className="text-sm text-gray-400">📍 {location}</p>
        <p className="mt-2 text-sm text-gray-500">
          🏷️ {category || "Uncategorized"}
        </p>
        <p className="mt-2 text-sm text-gray-500">📅 {date}</p>

        <Link
          to={`/item/${id}`}
          className="mt-5 block w-full rounded-lg bg-blue-600 py-2.5 text-center font-medium text-white transition hover:bg-blue-700"
        >
          View Item
        </Link>
      </div>
    </div>
  );
}

export default ItemCard;