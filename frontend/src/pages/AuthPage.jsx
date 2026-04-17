import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../api/client";
import { useAuth } from "../context/AuthContext";

const initialState = {
  name: "",
  email: "",
  password: "",
  role: "renter"
};

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      if (isForgotPassword) {
        const response = await request("/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email: form.email, password: form.password })
        });
        setMessage(response.message);
        setIsForgotPassword(false);
        return;
      }

      const payload = isSignup ? form : { email: form.email, password: form.password };
      const response = await login(payload, isSignup);
      navigate(response.user.role === "owner" ? "/owner" : response.user.role === "admin" ? "/admin" : "/renter");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">{isForgotPassword ? "Reset access" : isSignup ? "Create account" : "Welcome back"}</p>
        <h1>{isForgotPassword ? "Reset your password" : isSignup ? "Join RentEase" : "Log in to manage rentals"}</h1>
        <form onSubmit={handleSubmit} className="form-grid">
          {isSignup && !isForgotPassword && (
            <>
              <label>
                Full Name
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <label>
                Role
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="renter">Renter</option>
                  <option value="owner">Owner</option>
                </select>
              </label>
            </>
          )}
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </label>
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isForgotPassword ? "Reset Password" : isSignup ? "Create Account" : "Login"}
          </button>
        </form>
        <div className="auth-links">
          {!isForgotPassword && (
            <button
              className="text-button"
              onClick={() => {
                setIsSignup((current) => !current);
                setIsForgotPassword(false);
                setError("");
                setMessage("");
              }}
            >
              {isSignup ? "Already have an account? Log in" : "Need an account? Sign up"}
            </button>
          )}
          <button
            className="text-button"
            onClick={() => {
              setIsForgotPassword((current) => !current);
              setIsSignup(false);
              setError("");
              setMessage("");
            }}
          >
            {isForgotPassword ? "Back to login" : "Forgot password?"}
          </button>
        </div>
      </div>
    </section>
  );
}
