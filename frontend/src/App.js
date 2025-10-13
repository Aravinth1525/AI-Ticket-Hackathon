import React from "react";
import CreateTicket from "./components/CreateTicket";
import HealthPanel from "./components/HealthPanel";
import TicketTable from "./components/TicketTable";
import AnalyticsChart from "./components/AnalyticsChart";
import "./App.css";

function App() {
  const apiUrl = "http://localhost:8080"; // backend URL

  return (
    <div className="container">
      <h1>🧠 AI-First Customer Support</h1>
      <div style={{marginBottom:12}}>
        <HealthPanel />
      </div>
      <div className="card">
        <CreateTicket apiUrl={apiUrl} />
      </div>
      <div className="card">
        <TicketTable apiUrl={apiUrl} />
      </div>
      <div className="card">
        <AnalyticsChart apiUrl={apiUrl} />
      </div>
    </div>
  );
}

export default App;
