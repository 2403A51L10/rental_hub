import { useEffect, useState } from "react";
import { API_BASE_URL, request } from "../api/client";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";

const initialItem = {
  title: "",
  description: "",
  category: "",
  pricePerDay: "",
  availabilityStart: "",
  availabilityEnd: "",
  image: null
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function OwnerDashboard() {
  const { token, user, refreshMe } = useAuth();
  const [data, setData] = useState({ items: [], bookings: [], reviews: [], metrics: {} });
  const [form, setForm] = useState(initialItem);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    location: user?.location || "",
    avatar: user?.avatar || ""
  });
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
    setMessage("Listing submitted successfully.");
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

  const updateProfile = async (event) => {
    event.preventDefault();
    await request(
      "/profile/me",
      {
        method: "PUT",
        body: JSON.stringify(profile)
      },
      token
    );
    await refreshMe();
    setMessage("Profile updated.");
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

      <div className="dashboard-grid">
        <form className="panel form-grid" onSubmit={createListing}>
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
            Price Per Day
            <input type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} required />
          </label>
          <label>
            Availability Start
            <input type="date" value={form.availabilityStart} onChange={(e) => setForm({ ...form, availabilityStart: e.target.value })} required />
          </label>
          <label>
            Availability End
            <input type="date" value={form.availabilityEnd} onChange={(e) => setForm({ ...form, availabilityEnd: e.target.value })} required />
          </label>
          <label>
            Listing Image
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
          </label>
          <button className="primary-button" type="submit">
            Publish Listing
          </button>
        </form>

        <form className="panel form-grid" onSubmit={updateProfile}>
          <h2>Profile</h2>
          <label>
            Name
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
          </label>
          <label>
            Phone
            <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </label>
          <label>
            Location
            <input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
          </label>
          <label>
            Avatar URL
            <input value={profile.avatar} onChange={(e) => setProfile({ ...profile, avatar: e.target.value })} />
          </label>
          <label>
            Bio
            <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
          </label>
          <button className="ghost-button" type="submit">
            Save Profile
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
                    {currency.format(item.pricePerDay)}/day • {item.status}
                  </small>
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
                    {booking.renter?.name} • {new Date(booking.startDate).toLocaleDateString()} to{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
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
                {review.renter?.name} • {review.rating}/5
              </small>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
