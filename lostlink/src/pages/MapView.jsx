import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import { useItems } from "../context/ItemsContext";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Type shapes: lost = 🔍 style pin color not without plastugin; keep default blue.
function MapView() {
  const { items } = useItems();
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  const byLocation = useMemo(() => {
    const map = new Map();
    for (const item of items) {
      if (!item.location) continue;
      if (!map.has(item.location)) map.set(item.location, []);
      map.get(item.location).push(item);
    }
    return map;
  }, [items]);

  useEffect(() => {
    let cancelled = false;
    async function geocodeAll() {
      const out = [];
      for (const [location, locationItems] of byLocation) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`,
            { headers: { Accept: "application/json" } }
          );
          const results = await res.json();
          if (results[0]) {
            out.push({
              location,
              lat: parseFloat(results[0].lat),
              lon: parseFloat(results[0].lon),
              items: locationItems,
            });
          }
        } catch {
          // skip locations that fail to geocode
        }
      }
      if (!cancelled) {
        setPoints(out);
        setLoading(false);
      }
    }
    geocodeAll();
    return () => { cancelled = true; };
  }, [byLocation]);

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-white">Items Map</h2>
        <p className="mt-2 mb-8 text-gray-400">
          Items grouped by location. {loading && "Locating…"}
        </p>
        <div className="h-[70vh] overflow-hidden rounded-2xl border border-gray-800">
          <MapContainer center={[9.03, 38.74]} zoom={6} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.map((p) => (
              <Marker key={p.location} position={[p.lat, p.lon]}>
                <Popup>
                  <p className="mb-1 font-semibold">{p.location}</p>
                  {p.items.slice(0, 5).map((it) => (
                    <div key={it.id}>
                      <Link to={`/item/${it.id}`}>{it.title}</Link> ({it.type})
                    </div>
                  ))}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}

export default MapView;
