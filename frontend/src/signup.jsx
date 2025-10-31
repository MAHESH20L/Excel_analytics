import React, { useState } from "react";

function Signup() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    birthday: ""
  });
  const [msg, setMsg] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      name: form.username,
      password: form.password,
      birthday: form.birthday,
      fullName: form.name
    };
    try {
      const res = await fetch("http://localhost:4000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok) {
        setMsg("Signup successful! You can login now.");
        setForm({ username: "", password: "", name: "", birthday: "" });
      } else {
        setMsg(resData.error || "Signup failed.");
      }
    } catch (err) {
      setMsg("Signup request error.");
    }
  };

  return (
    <main className="dataviz-main">
      {/* Embedded CSS styling for quick use */}
      <style>{`
        .auth-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
          max-width: 370px;
          margin: 48px auto;
          padding: 36px 32px 32px 32px;
          background: rgba(255,255,255,0.12);
          border-radius: 26px;
          box-shadow: 0 4px 24px #6c57a333;
        }
        .auth-form h2 {
          margin-bottom: 12px;
          font-size: 1.85rem;
          font-weight: 700;
        }
        .auth-form input {
          width: 100%;
          padding: 13px 15px;
          font-size: 1.05rem;
          border: 1.8px solid #b2a9fa;
          border-radius: 18px;
          outline: none;
          background: #f9f7fd;
          transition: border-color 0.2s;
        }
        .auth-form input:focus {
          border-color: #8f94fb;
          background: #ecf0fc;
        }
        .auth-form button.primary-btn {
          width: 100%;
          padding: 15px 0;
          margin-top: 8px;
          font-size: 1.13rem;
          font-weight: 700;
          border-radius: 20px;
          box-shadow: 0 3px 16px #7f58e139;
          transition: background 0.15s;
        }
      `}</style>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="birthday"
          value={form.birthday}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="primary-btn" type="submit">Signup</button>
        {msg && <p>{msg}</p>}
      </form>
    </main>
  );
}

export default Signup;
