import React, { useState } from "react";

export default function CreateTicket({ apiUrl }) {
  const [form, setForm] = useState({ question: "", customer: "", category: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim()) return;

    const res = await fetch(`${apiUrl}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMsg("✅ Ticket submitted successfully!");
      setForm({ question: "", customer: "", category: "" });
      setTimeout(() => setMsg(""), 2500);
    } else {
      setMsg("❌ Error submitting ticket!");
    }
  };

  return (
    <div>
      <h2>📩 Create New Ticket</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
        <input
          name="question"
          placeholder="Describe your issue..."
          value={form.question}
          onChange={handleChange}
          className="search-bar"
          style={{ flex: 1 }}
        />
        <input
          name="customer"
          placeholder="Customer"
          value={form.customer}
          onChange={handleChange}
          style={{ width: "150px" }}
        />

        {/* 🟢 Category dropdown */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={{
            width: "200px",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#f9fafb",
          }}
        >
          <option value="">Select Category</option>
          <option value="Internet">Internet Issues</option>
          <option value="SMS">SMS Delivery</option>
          <option value="VPN">VPN Connectivity</option>
          <option value="Email">Email/SMTP</option>
          <option value="WiFi">Wi-Fi Connection</option>
          <option value="Printer">Printer Issues</option>
          <option value="Database">Database/Timeouts</option>
          <option value="Application">App Crashes/Startup</option>
          <option value="Password">Password/Account</option>
          <option value="DNS">DNS Resolution</option>
          <option value="Authentication">2FA/OTP</option>
          <option value="File Sharing">File Share Access</option>
        </select>

        <button type="submit" className="refresh">
          ➕ Submit
        </button>
      </form>

      {msg && <p style={{ marginTop: "10px", color: "#15803d" }}>{msg}</p>}
    </div>
  );
}
