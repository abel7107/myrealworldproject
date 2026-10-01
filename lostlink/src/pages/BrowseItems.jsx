import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useItems } from "../context/ItemsContext";
import ItemCard from "../components/ItemCard";

function BrowseItems() {
  const { items } = useItems();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");

  const locations = useMemo(
    () => [...new Set(items.map((item) => item.location))],
    [items]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase());
      const matchesType =
        filterType === "all" || item.type.toLowerCase() === filterType;
      const matchesLocation =
        filterLocation === "all" || item.location === filterLocation;
      return matchesSearch && matchesType && matchesLocation;
    });
  }, [items, search, filterType, filterLocation]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(search ? { q: search } : {});
  };

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-500">
            Browse
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Lost & Found Items
          </h2>
          <p className="mt-3 max-w-2xl text-gray-400">
            Search through all reported items to find what you're looking for.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
          <form onSubmit={handleSearch} className="flex flex-1 gap-3">
            <div className="flex flex-1 items-center rounded-xl border border-gray-700 bg-gray-900 px-4">
              <span className="mr-3 text-xl">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or category..."
                className="w-full bg-transparent py-3 text-white outline-none placeholder:text-gray-500"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none"
            >
              <option value="all">All Types</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>

            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="mb-6 text-sm text-gray-500">
          Showing {filteredItems.length} of {items.length} items
        </p>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-6xl">🔍</p>
            <p className="mt-4 text-xl text-gray-400">No items found</p>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default BrowseItems;