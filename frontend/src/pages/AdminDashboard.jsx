import { useEffect, useState } from "react";
import { request } from "../api/client";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState({ metrics: {}, users: [], items: [], bookings: [] });

  const load = async () => {
    const response = await request("/admin/analytics", {}, token);
    setData(response);
  };

  useEffect(() => {
    load();
  }, []);

  const moderate = async (id, status) => {
    await request(
      `/admin/listings/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status })
      },
      token
    );
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
            {data.users.map((user) => (
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
          <h2>Listing Moderation</h2>
          <div className="stack-list">
            {data.items.map((item) => (
              <article key={item._id} className="data-card">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.owner?.name}</p>
                  <small>{item.status}</small>
                </div>
                <div className="action-row">
                  <button className="primary-button" type="button" onClick={() => moderate(item._id, "approved")}>
                    Approve
                  </button>
                  <button className="ghost-button" type="button" onClick={() => moderate(item._id, "rejected")}>
                    Reject
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
