import { useState } from "react";

function Hero() {
  const [search, setSearch] = useState("");

  return (
    <section className="relative overflow-hidden bg-gray-950">
      <div className="mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 text-center">

        {/* Small Badge */}
        <div className="mb-6 rounded-full border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-400">
          🔎 Reconnect people with their lost belongings
        </div>

        {/* Heading */}
        <h1 className="max-w-4xl text-5xl font-bold leading-tight text-white md:text-7xl">
          Find What Was Lost.
          <br />
          <span className="text-blue-500">
            Return What Was Found.
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          LostLink helps people report lost and found items,
          search for belongings, and reconnect items with their owners.
        </p>

        {/* Search */}
        <div className="mt-10 flex w-full max-w-2xl flex-col gap-3 sm:flex-row">

          <div className="flex flex-1 items-center rounded-xl border border-gray-700 bg-gray-900 px-4">
            <span className="mr-3 text-xl">🔍</span>

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a lost or found item..."
                className="w-full bg-transparent py-4 text-white outline-none placeholder:text-gray-500"
/>
          </div>

          <button
              onClick={() => console.log("Searching for:", search)}
              className="rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
            >
              Search
            </button>

        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">

          <button className="rounded-xl bg-white px-6 py-3 font-semibold text-gray-950 transition hover:bg-gray-200">
            Report Lost Item
          </button>

          <button className="rounded-xl border border-gray-700 px-6 py-3 font-semibold text-white transition hover:bg-gray-900">
            Report Found Item
          </button>

        </div>

      </div>
    </section>
  );
}

export default Hero;