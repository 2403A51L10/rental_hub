import { useEffect, useState } from "react";
import { request } from "../api/client";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR"
});

export default function AdminDashboard() {
  const { token, user: currentUser } = useAuth();
  const [data, setData] = useState({ metrics: {}, users: [], items: [], bookings: [] });

  const load = async () => {
    const response = await request("/admin/analytics", {}, token);
    setData(response);
  };

  useEffect(() => {
    load();
  }, []);

  const deleteListing = async (id) => {
    await request(`/items/${id}`, { method: "DELETE" }, token);
    load();
  };

  return (
    <section className="dashboard page-pad">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Admin Control</p>
          <h1>Monitor users, listings, bookings, and platform revenue.</h1>
        </div>
        <div className="stats-grid">
          <StatCard label="Users" value={data.metrics.totalUsers || 0} />
          <StatCard label="Bookings" value={data.metrics.totalBookings || 0} />
          <StatCard label="Revenue" value={currency.format(data.metrics.totalRevenue || 0)} />
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <h2>Users</h2>
          <div className="stack-list">
            {data.users
              .filter((user) => user._id !== currentUser?.id)
              .map((user) => (
              <article key={user._id} className="data-card">
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                </div>
                <span className="role-pill">{user.role}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>All Listings</h2>
          <div className="stack-list">
            {data.items.map((item) => (
              <article key={item._id} className="data-card">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.owner?.name}</p>
                  <small>{item.status}</small>
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
      </div>
    </section>
  );
}
