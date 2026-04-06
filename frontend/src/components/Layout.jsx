import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleLinks = {
  owner: [{ to: "/owner", label: "Owner Dashboard" }],
  renter: [{ to: "/renter", label: "Renter Dashboard" }],
  admin: [{ to: "/admin", label: "Admin Dashboard" }]
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          RentEase
        </Link>
        <nav className="nav">
          <NavLink to="/">Marketplace</NavLink>
          {!user && <NavLink to="/auth">Login</NavLink>}
          {user &&
            roleLinks[user.role]?.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
        </nav>
        <div className="topbar-actions">
          {user ? (
            <>
              <span className="role-pill">{user.role}</span>
              <button className="ghost-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="primary-button" to="/auth">
              Get Started
            </Link>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
