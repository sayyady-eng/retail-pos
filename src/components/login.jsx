import { useState } from "react";
import { ShoppingCart, Eye, EyeOff, Lock, User } from "lucide-react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary login for testing
    if (username === "admin" && password === "admin123") {
      setError("");
      onLogin();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <div className="login-icon">
            <ShoppingCart size={32} />
          </div>

          <h1>RetailPOS</h1>
          <p>Retail Management System</p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="login-field">
            <label>Username</label>

            <div className="input-wrapper">
              <User size={20} />

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label>Password</label>

            <div className="input-wrapper">
              <Lock size={20} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button type="submit" className="login-button">
            Login
          </button>

        </form>

        <div className="login-footer">
          RetailPOS © 2026
        </div>

      </div>
    </div>
  );
}

export default Login;