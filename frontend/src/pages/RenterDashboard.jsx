import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL, request } from "../api/client";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const calcDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  return Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
};

export default function RenterDashboard() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [reviewForm, setReviewForm] = useState({ bookingId: "", rating: 5, comment: "" });
  const [message, setMessage] = useState("");

  const load = async () => {
    const [itemData, bookingData] = await Promise.all([
      request("/items"),
      request("/bookings/renter/history", {}, token)
    ]);
    setItems(itemData);
    setBookings(bookingData);
  };

  useEffect(() => {
    load();
  }, []);

  const currentItem = useMemo(() => items.find((item) => item._id === selectedItem), [items, selectedItem]);
  const totalPrice = currentItem ? calcDays(dates.startDate, dates.endDate) * currentItem.pricePerDay : 0;

  const bookItem = async (event) => {
    event.preventDefault();
    await request(
      "/bookings",
      {
        method: "POST",
        body: JSON.stringify({ itemId: selectedItem, ...dates })
      },
      token
    );
    setMessage("Booking request sent.");
    setDates({ startDate: "", endDate: "" });
    load();
  };

  const completeBooking = async (id) => {
    await request(`/bookings/${id}/complete`, { method: "PATCH" }, token);
    setMessage("Booking marked as completed.");
    load();
  };

  const submitReview = async (event) => {
    event.preventDefault();
    await request("/reviews", { method: "POST", body: JSON.stringify(reviewForm) }, token);
    setReviewForm({ bookingId: "", rating: 5, comment: "" });
    setMessage("Review posted.");
    load();
  };

  return (
    <section className="dashboard page-pad">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Renter Hub</p>
          <h1>Browse listings, book confidently, and review completed rentals.</h1>
        </div>
        <div className="stats-grid">
          <StatCard label="Available Items" value={items.length} />
          <StatCard label="Bookings" value={bookings.length} />
          <StatCard label="Completed" value={bookings.filter((booking) => booking.status === "completed").length} />
        </div>
      </div>

      {message && <p className="success-text">{message}</p>}

      <div className="dashboard-grid">
        <form className="panel form-grid" onSubmit={bookItem}>
          <h2>Book an Item</h2>
          <label>
            Choose Item
            <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)} required>
              <option value="">Select a listing</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title} - {currency.format(item.pricePerDay)}/day
                </option>
              ))}
            </select>
          </label>
          <label>
            Start Date
            <input type="date" value={dates.startDate} onChange={(e) => setDates({ ...dates, startDate: e.target.value })} required />
          </label>
          <label>
            End Date
            <input type="date" value={dates.endDate} onChange={(e) => setDates({ ...dates, endDate: e.target.value })} required />
          </label>
          <div className="price-box">
            <span>Total</span>
            <strong>{currency.format(totalPrice || 0)}</strong>
          </div>
          <button className="primary-button" type="submit" disabled={!selectedItem}>
            Send Booking Request
          </button>
        </form>

        <section className="panel">
          <h2>Available Listings</h2>
          <div className="stack-list">
            {items.map((item) => (
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
                    {currency.format(item.pricePerDay)}/day • {item.owner?.name}
                  </small>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <h2>Booking History</h2>
          <div className="stack-list">
            {bookings.map((booking) => (
              <article key={booking._id} className="data-card">
                <div>
                  <strong>{booking.item?.title}</strong>
                  <p>
                    {new Date(booking.startDate).toLocaleDateString()} to{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <small>{currency.format(booking.totalPrice)}</small>
                </div>
                <div className="action-row">
                  <span className={`status-chip status-${booking.status}`}>{booking.status}</span>
                  {booking.status === "approved" && (
                    <button className="ghost-button" type="button" onClick={() => completeBooking(booking._id)}>
                      Mark Complete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <form className="panel form-grid" onSubmit={submitReview}>
          <h2>Leave a Review</h2>
          <label>
            Completed Booking
            <select value={reviewForm.bookingId} onChange={(e) => setReviewForm({ ...reviewForm, bookingId: e.target.value })} required>
              <option value="">Choose booking</option>
              {bookings
                .filter((booking) => booking.status === "completed")
                .map((booking) => (
                  <option key={booking._id} value={booking._id}>
                    {booking.item?.title}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Rating
            <input
              type="number"
              min="1"
              max="5"
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
              required
            />
          </label>
          <label>
            Comment
            <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} required />
          </label>
          <button className="primary-button" type="submit">
            Submit Review
          </button>
        </form>
      </div>
    </section>
  );
}
