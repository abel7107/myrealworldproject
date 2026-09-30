function ItemCard({ title, type, location, date }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">

      {/* Image placeholder */}
      <div className="flex h-48 items-center justify-center bg-gray-800">
        <span className="text-5xl">📦</span>
      </div>

      {/* Content */}
      <div className="p-5">

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
            {title}
          </h3>

          <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-400">
            {type}
          </span>
        </div>

        <p className="text-sm text-gray-400">
          📍 {location}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          📅 {date}
        </p>

        <button className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700">
          View Item
        </button>

      </div>
    </div>
  );
}

export default ItemCard;