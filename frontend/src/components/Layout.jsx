import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { request } from "../api/client";
import { useAuth } from "../context/AuthContext";

const roleLinks = {
  owner: [{ to: "/owner", label: "Owner Dashboard" }],
  renter: [{ to: "/renter", label: "Renter Dashboard" }],
  admin: [{ to: "/admin", label: "Admin Dashboard" }]
};

export default function Layout({ children }) {
  const { token, user, logout, refreshMe } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    location: "",
    avatar: "",
    bio: ""
  });
  const [profileMessage, setProfileMessage] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      phone: user?.phone || "",
      location: user?.location || "",
      avatar: user?.avatar || "",
      bio: user?.bio || ""
    });
  }, [user]);

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    await request(
      "/profile/me",
      {
        method: "PUT",
        body: JSON.stringify(profileForm)
      },
      token
    );
    await refreshMe();
    setProfileMessage("Profile updated.");
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
              {user.role !== "admin" && <span className="role-pill">{user.role}</span>}
              <button
                className="ghost-button"
                onClick={() => {
                  setProfileMessage("");
                  setIsProfileOpen(true);
                }}
              >
                Profile
              </button>
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
      {user && isProfileOpen && (
        <div className="modal-backdrop" onClick={() => setIsProfileOpen(false)}>
          <div className="profile-modal panel" onClick={(event) => event.stopPropagation()}>
            <div className="profile-modal-head">
              <div className="profile-inline">
                <div className="profile-avatar small-avatar">
                  {profileForm.avatar ? (
                    <img src={profileForm.avatar} alt={profileForm.name || "Profile avatar"} />
                  ) : (
                    <span>{(profileForm.name || user.name || "U").charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="eyebrow">Account</p>
                  <h2>Update Profile</h2>
                </div>
              </div>
              <button className="text-button" onClick={() => setIsProfileOpen(false)} type="button">
                Close
              </button>
            </div>

            {profileMessage && <p className="success-text">{profileMessage}</p>}

            <form className="form-grid" onSubmit={handleProfileUpdate}>
              <label>
                Name
                <input value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} required />
              </label>
              <label>
                Phone
                <input value={profileForm.phone} onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })} />
              </label>
              <label>
                Location
                <input value={profileForm.location} onChange={(event) => setProfileForm({ ...profileForm, location: event.target.value })} />
              </label>
              <label>
                Avatar URL
                <input value={profileForm.avatar} onChange={(event) => setProfileForm({ ...profileForm, avatar: event.target.value })} />
              </label>
              <label>
                Bio
                <textarea value={profileForm.bio} onChange={(event) => setProfileForm({ ...profileForm, bio: event.target.value })} />
              </label>
              <button className="primary-button" type="submit">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      )}
      <main>{children}</main>
    </div>
  );
}
