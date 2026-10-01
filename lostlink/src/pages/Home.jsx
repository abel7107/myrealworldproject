import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useItems } from "../context/ItemsContext";
import ItemCard from "../components/ItemCard";

function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { items } = useItems();

  const recentItems = items.slice(0, 6);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/items?q=${encodeURIComponent(search)}`);
  };

  return (
    <>
      {/* Hero Section */}
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
            <span className="text-blue-500">Return What Was Found.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            LostLink helps people report lost and found items, search for
            belongings, and reconnect items with their owners.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mt-10 flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
          >
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
              type="submit"
              className="rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/report?type=lost"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-gray-950 transition hover:bg-gray-200"
            >
              Report Lost Item
            </Link>
            <Link
              to="/report?type=found"
              className="rounded-xl border border-gray-700 px-6 py-3 font-semibold text-white transition hover:bg-gray-900"
            >
              Report Found Item
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Items */}
      <section className="bg-gray-950 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-500">
              Recent Reports
            </p>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Recently Lost & Found
            </h2>
            <p className="mt-3 max-w-2xl text-gray-400">
              Browse the latest items reported by people in the community.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentItems.map((item) => (
              <ItemCard key={item.id} {...item} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/items"
              className="inline-block rounded-xl border border-gray-700 px-6 py-3 font-semibold text-white transition hover:bg-gray-900"
            >
              View All Items →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;