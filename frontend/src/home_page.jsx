import React, { useState } from "react";
import "./App.css";
import Login from "./login";
import Signup from "./signup";
import Upload from "./upload";
import Admin from "./admin";  // Import your Admin component

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [highlight, setHighlight] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage("home");
    setHighlight(false);
  };

  // New handler for admin login
  const handleAdminLogin = () => {
    setUser({ name: "maheshadmin", role: "admin" });
    setPage("admin");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("home");
  };

  const handleUploadClick = () => {
    if (!user) {
      alert("Please login or signup before you do upload.");
      setHighlight(true);
      setTimeout(() => setHighlight(false), 3000);
    } else {
      setPage("upload");
    }
  };

  return (
    <div className="dataviz-wrapper">
      <header className="dataviz-header">
        <div className="dataviz-logo">
          <div className="logo-icon">D</div>
          <span className="logo-text">excel_analytics</span>
        </div>
        <button className="upload-btn" onClick={handleUploadClick}>
          Upload File
        </button>

        <div className="header-icons">
          {!user && (
            <>
              <button
                className={`primary-btn ${highlight ? "highlight" : ""}`}
                onClick={() => setPage("login")}
              >
                Login
              </button>
              <button
                className={`primary-btn ${highlight ? "highlight" : ""}`}
                onClick={() => setPage("signup")}
              >
                Signup
              </button>
            </>
          )}
          {user && (
            <button className="primary-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </header>

      {page === "home" && (
        <main className="dataviz-main">
          <h1 className="main-title">
            Transform Excel Data into
            <br />
            Stunning Visualizations
          </h1>
          <p className="main-desc">
            Upload your spreadsheets and create interactive 2D/3D charts in seconds. No coding required.
          </p>
          <div className="main-buttons">
            <button className="primary-btn" onClick={handleUploadClick}>
              Upload Your First File
            </button>
          </div>
        </main>
      )}
      {page === "signup" && <Signup />}
      {page === "login" && (
        <Login onLoginSuccess={handleLoginSuccess} onAdminLogin={handleAdminLogin} />
      )}
      {page === "upload" && <Upload />}
      {page === "admin" && <Admin />}
    </div>
  );
}

export default App;
