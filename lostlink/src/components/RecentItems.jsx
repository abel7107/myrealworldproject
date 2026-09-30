import ItemCard from "./ItemCard";
import items from "../data/items";

function RecentItems() {
  return (
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

          {items.map((item) => (
            <ItemCard
              key={item.id}
              title={item.title}
              type={item.type}
              location={item.location}
              date={item.date}
            />
          ))}

        </div>

      </div>

    </section>
  );
}

export default RecentItems;