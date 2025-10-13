// import React from "react";
// import CreateTicket from "./components/CreateTicket";
// import HealthPanel from "./components/HealthPanel";
// import TicketTable from "./components/TicketTable";
// import AnalyticsChart from "./components/AnalyticsChart";
// import "./App.css";

// function App() {
//   const apiUrl = "http://localhost:8080"; // backend URL

//   return (
//     <div className="container">
//       <h1>🧠 AI-First Customer Support</h1>
//       <div style={{marginBottom:12}}>
//         <HealthPanel />
//       </div>
//       <div className="card">
//         <CreateTicket apiUrl={apiUrl} />
//       </div>
//       <div className="card">
//         <TicketTable apiUrl={apiUrl} />
//       </div>
//       <div className="card">
//         <AnalyticsChart apiUrl={apiUrl} />
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import CreateTicket from "./components/CreateTicket";
import HealthPanel from "./components/HealthPanel";
import TicketTable from "./components/TicketTable";
import AnalyticsChart from "./components/AnalyticsChart";
import Login from "./components/Login";
import "./App.css";

function App() {
  const apiUrl = "http://localhost:8080";

  // Initialize role from localStorage
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  const handleLogin = (userRole) => {
    localStorage.setItem("role", userRole); // persist
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("role"); // clear
    setRole(null);
  };

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>🧠 AI-First Customer Support</h1>
        <button onClick={handleLogout} style={{ padding: "6px 12px" }}>
          Logout
        </button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <HealthPanel />
      </div>

      {role === "USER" && (
        <div className="card">
          <CreateTicket apiUrl={apiUrl} />
        </div>
      )}

      <div className="card">
        <TicketTable apiUrl={apiUrl} role={role} />
      </div>

      <div className="card">
        <AnalyticsChart apiUrl={apiUrl} />
      </div>
    </div>
  );
}

export default App;
