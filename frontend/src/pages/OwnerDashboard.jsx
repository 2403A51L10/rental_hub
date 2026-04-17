import { useEffect, useState } from "react";
import { API_BASE_URL, request } from "../api/client";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";

const initialItem = {
  title: "",
  description: "",
  category: "",
  pricePerHour: "",
  availabilityStart: "",
  availabilityEnd: "",
  image: null
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR"
});

export default function OwnerDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState({ items: [], bookings: [], reviews: [], metrics: {} });
  const [form, setForm] = useState(initialItem);
  const [message, setMessage] = useState("");

  const loadDashboard = async () => {
    const response = await request("/items/owner/dashboard", {}, token);
    setData(response);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const createListing = async (event) => {
    event.preventDefault();
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => value && body.append(key, value));
    await request("/items", { method: "POST", body }, token);
    setForm(initialItem);
    setMessage("Listing published successfully.");
    loadDashboard();
  };

  const updateBookingStatus = async (id, status) => {
    await request(
      `/bookings/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status })
      },
      token
    );
    loadDashboard();
  };

  const deleteListing = async (id) => {
    await request(`/items/${id}`, { method: "DELETE" }, token);
    setMessage("Listing deleted successfully.");
    loadDashboard();
  };

  return (
    <section className="dashboard page-pad">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Owner Workspace</p>
          <h1>Manage listings, bookings, reviews, and revenue.</h1>
        </div>
        <div className="stats-grid">
          <StatCard label="Listings" value={data.metrics.totalItems || 0} />
          <StatCard label="Pending Requests" value={data.metrics.pendingBookings || 0} />
          <StatCard label="Revenue" value={currency.format(data.metrics.totalRevenue || 0)} />
        </div>
      </div>

      {message && <p className="success-text">{message}</p>}

      <div className="dashboard-grid owner-create-row">
        <form className="panel form-grid owner-create-panel" onSubmit={createListing}>
          <h2>Create Listing</h2>
          <label>
            Title
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </label>
          <label>
            Description
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </label>
          <label>
            Category
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </label>
          <label>
            Price Per Hour
            <input type="number" value={form.pricePerHour} onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })} required />
          </label>
          <label>
            Start Time
            <input type="datetime-local" value={form.availabilityStart} onChange={(e) => setForm({ ...form, availabilityStart: e.target.value })} required />
          </label>
          <label>
            End Time
            <input type="datetime-local" value={form.availabilityEnd} onChange={(e) => setForm({ ...form, availabilityEnd: e.target.value })} required />
          </label>
          <label>
            Listing Image
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
          </label>
          <button className="primary-button" type="submit">
            Publish Listing
          </button>
        </form>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <h2>Your Listings</h2>
          <div className="stack-list">
            {data.items.map((item) => (
              <article key={item._id} className="data-card">
                {item.imageUrl ? (
                  <img src={`${API_BASE_URL.replace("/api", "")}${item.imageUrl}`} alt={item.title} />
                ) : (
                  <div className="image-fallback compact">No image</div>
                )}
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  <small>
                    {currency.format(item.pricePerHour)}/hour | {item.status}
                  </small>
                </div>
                <div className="action-row">
                  <button className="ghost-button" type="button" onClick={() => deleteListing(item._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Booking Requests</h2>
          <div className="stack-list">
            {data.bookings.map((booking) => (
              <article key={booking._id} className="data-card">
                <div>
                  <strong>{booking.item?.title}</strong>
                  <p>
                    {booking.renter?.name} | {new Date(booking.startDate).toLocaleString()} to {new Date(booking.endDate).toLocaleString()}
                  </p>
                  <small>{currency.format(booking.totalPrice)}</small>
                </div>
                <div className="action-row">
                  <span className={`status-chip status-${booking.status}`}>{booking.status}</span>
                  {booking.status === "pending" && (
                    <>
                      <button className="primary-button" type="button" onClick={() => updateBookingStatus(booking._id, "approved")}>
                        Approve
                      </button>
                      <button className="ghost-button" type="button" onClick={() => updateBookingStatus(booking._id, "rejected")}>
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <h2>Latest Reviews</h2>
        <div className="review-grid">
          {data.reviews.map((review) => (
            <article key={review._id} className="review-card">
              <strong>{review.item?.title}</strong>
              <p>{review.comment}</p>
              <small>
                {review.renter?.name} | {review.rating}/5
              </small>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
