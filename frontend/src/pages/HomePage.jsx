import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, request } from "../api/client";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR"
});

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ q: "", category: "", minPrice: "", maxPrice: "" });
  const [error, setError] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value && params.append(key, value));
    const query = params.toString();
    return query ? `?${query}` : "";
  }, [filters]);

  useEffect(() => {
    request(`/items${queryString}`)
      .then(setItems)
      .catch((err) => setError(err.message));
  }, [queryString]);

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Rent smarter, not harder</p>
          <h1>Discover rentable gear, spaces, and everyday essentials in one place.</h1>
          <p className="hero-copy">
            Owners publish verified listings. Renters search, book, review, and manage bookings from a clean role-based dashboard.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/auth">
              Start Renting
            </Link>
            <Link className="ghost-button" to="/owner">
              Owner View
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="gradient-card">
            <strong>Role-based marketplace</strong>
            <span>Owner dashboards, renter journeys, and admin analytics in one stack.</span>
          </div>
        </div>
      </section>

      <section className="filter-bar">
        <input placeholder="Search items" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <input placeholder="Category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
        <input placeholder="Min price" type="number" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
        <input placeholder="Max price" type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
      </section>

      {error && <p className="error-text page-pad">{error}</p>}

      <section className="listing-grid page-pad">
        {items.map((item) => (
          <article key={item._id} className="listing-card">
            {item.imageUrl ? (
              <img src={`${API_BASE_URL.replace("/api", "")}${item.imageUrl}`} alt={item.title} />
            ) : (
              <div className="image-fallback">No image uploaded</div>
            )}
            <div className="listing-card-body">
              <div className="listing-card-top">
                <h3>{item.title}</h3>
                <span>{currency.format(item.pricePerHour)}/hour</span>
              </div>
              <p>{item.description}</p>
              <div className="meta-row">
                <span>{item.category}</span>
                <span>{item.owner?.name}</span>
                <span>{item.avgRating ? `${item.avgRating}/5` : "New"}</span>
              </div>
              <Link className="primary-button" to="/auth">
                Book This Item
              </Link>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
