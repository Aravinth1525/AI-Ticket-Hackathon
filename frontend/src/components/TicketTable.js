// import React, { useEffect, useState } from "react";

// export default function TicketTable({ apiUrl }) {
//   const [tickets, setTickets] = useState([]);
//   const [search, setSearch] = useState("");

//   const fetchTickets = async () => {
//     const res = await fetch(`${apiUrl}/tickets`);
//     const data = await res.json();
//     setTickets(data);
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   const handleResolve = async (id) => {
//     const reply = prompt("Enter manual reply:");
//     if (!reply) return;
//     await fetch(`${apiUrl}/tickets/${id}/resolve`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ reply, agent: "human" }),
//     });
//     fetchTickets();
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Delete ticket ' + id + '?')) return;
//     await fetch(`${apiUrl}/tickets/${id}`, { method: 'DELETE' });
//     fetchTickets();
//   };

//   const filtered = tickets.filter((t) =>
//     t.question.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div>
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <input
//           placeholder="Search tickets..."
//           className="search-bar"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <button className="refresh" onClick={fetchTickets}>
//           🔄 Refresh
//         </button>
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Customer</th>
//             <th>Category</th>
//             <th>Question</th>
//             <th>Status</th>
//             <th>Bot Reply</th>
//             <th>Confidence</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filtered.map((t) => (
//             <tr key={t.id}>
//               <td>{t.id.slice(0, 6)}...</td>
//               <td>{t.customer}</td>
//               <td>{t.category}</td>
//               <td>{t.question}</td>
//               <td className={t.status === "Resolved" ? "status-resolved" : t.status === "Created" ? "status-created" : "status-pending"}>
//                 {t.status}
//               </td>
//               <td>{t.botReply}</td>
//               <td>{(t.confidence * 100).toFixed(1)}%</td>
//               <td>
//                 {t.status !== "Resolved" ? (
//                   <>
//                     <button className="action-btn" onClick={() => handleResolve(t.id)}>Resolve</button>
//                     <button className="action-btn secondary" style={{marginLeft:8}} onClick={() => handleDelete(t.id)}>Delete</button>
//                   </>
//                 ) : (
//                   <>
//                     <button className="action-btn ghost" onClick={() => fetch(`${apiUrl}/tickets/${t.id}/status`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({status:'Pending'})}).then(()=>fetchTickets())}>Change Status</button>
//                     <button className="action-btn secondary" style={{marginLeft:8}} onClick={() => handleDelete(t.id)}>Delete</button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";

// export default function TicketTable({ apiUrl }) {
//   const [tickets, setTickets] = useState([]);
//   const [search, setSearch] = useState("");

//   const fetchTickets = async () => {
//     const res = await fetch(`${apiUrl}/tickets`);
//     const data = await res.json();
//     setTickets(data);
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   const handleResolve = async (id, botReply) => {
//     let reply = botReply || prompt("Enter manual reply:");
//     if (!reply) return;
//     await fetch(`${apiUrl}/tickets/${id}/resolve`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ reply, agent: botReply ? "bot" : "human" }),
//     });
//     fetchTickets();
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Delete ticket ' + id + '?')) return;
//     await fetch(`${apiUrl}/tickets/${id}`, { method: 'DELETE' });
//     fetchTickets();
//   };

//   const filtered = tickets.filter((t) =>
//     t.question.toLowerCase().includes(search.toLowerCase())
//   );

//   const formatConfidence = (c) => {
//     if (c == null) return "0.0%";
//     let val = Number(c);
//     if (val <= 1) val = val * 100;
//     return val.toFixed(1) + "%";
//   };

//   return (
//     <div>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
//         <input
//           placeholder="Search tickets..."
//           className="search-bar"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <button className="refresh" onClick={fetchTickets}>🔄 Refresh</button>
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Customer</th>
//             <th>Category</th>
//             <th>Question</th>
//             <th>Status</th>
//             <th>Bot Reply</th>
//             <th>Confidence</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filtered.map((t) => (
//             <tr key={t.id}>
//               <td>{t.id.slice(0, 6)}...</td>
//               <td>{t.customer}</td>
//               <td>{t.category}</td>
//               <td>{t.question}</td>
//               <td className={
//                 t.status === "Resolved" ? "status-resolved" :
//                 t.status === "Created" ? "status-created" : "status-pending"
//               }>
//                 {t.status}
//               </td>
//               <td>{t.botReply}</td>
//               <td>{formatConfidence(t.confidence)}</td>
//               <td>
//                 {t.status !== "Resolved" ? (
//                   <>
//                     {t.botReply && <button className="action-btn" onClick={() => handleResolve(t.id, t.botReply)}>Accept Bot</button>}
//                     <button className="action-btn secondary" style={{marginLeft:8}} onClick={() => handleDelete(t.id)}>Delete</button>
//                   </>
//                 ) : (
//                   <>
//                     <button className="action-btn ghost" onClick={() => fetch(`${apiUrl}/tickets/${t.id}/status`, {
//                       method:'POST', 
//                       headers:{'Content-Type':'application/json'}, 
//                       body: JSON.stringify({status:'Pending'})
//                     }).then(()=>fetchTickets())}>Change Status</button>
//                     <button className="action-btn secondary" style={{marginLeft:8}} onClick={() => handleDelete(t.id)}>Delete</button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";

// export default function TicketTable({ apiUrl }) {
//   const [tickets, setTickets] = useState([]);
//   const [search, setSearch] = useState("");

//   const fetchTickets = async () => {
//     const res = await fetch(`${apiUrl}/tickets`);
//     const data = await res.json();

//     // Store original AI reply/confidence for restore
//     const updated = data.map((t) => ({
//       ...t,
//       originalBotReply: t.originalBotReply ?? t.botReply,
//       originalBotConfidence: t.originalBotConfidence ?? t.confidence,
//       currentReply: t.currentReply ?? t.botReply,
//     }));

//     setTickets(updated);
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   const handleResolve = async (ticket, manual = false) => {
//     let replyToSend;
//     let confidenceToSend;

//     if (!manual && ticket.acceptBotClicked) {
//       // Accept Bot: restore original AI reply
//       replyToSend = ticket.originalBotReply;
//       confidenceToSend = ticket.originalBotConfidence;
//     } else if (manual) {
//       // Manual resolve: prompt for reply
//       const reply = prompt("Enter manual reply:", ticket.currentReply || "");
//       if (!reply) return;
//       replyToSend = reply;
//       confidenceToSend = 1.0;
//     } else {
//       // Default bot resolve
//       replyToSend = ticket.botReply;
//       confidenceToSend = ticket.confidence;
//     }

//     // Send resolved reply to backend with status=Resolved
//     await fetch(`${apiUrl}/tickets/${ticket.id}/resolve`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         reply: replyToSend,
//         agent: !manual ? "bot" : "human",
//         confidence: confidenceToSend,
//         status: "Resolved", // ✅ ensure backend updates status
//       }),
//     });

//     // Update ticket locally
//     setTickets((prev) =>
//       prev.map((t) =>
//         t.id === ticket.id
//           ? {
//               ...t,
//               currentReply: replyToSend,
//               confidence: confidenceToSend,
//               status: "Resolved", // ✅ update status locally
//             }
//           : t
//       )
//     );
//   };

//   const handleDelete = async (id) => {
//     if (!confirm(`Delete ticket ${id}?`)) return;
//     await fetch(`${apiUrl}/tickets/${id}`, { method: "DELETE" });
//     fetchTickets();
//   };

//   const filtered = tickets.filter((t) =>
//     t.question.toLowerCase().includes(search.toLowerCase())
//   );

//   const formatConfidence = (c) => {
//     if (c == null) return "0.0%";
//     let val = Number(c);
//     if (val <= 1) val = val * 100;
//     return val.toFixed(1) + "%";
//   };

//   return (
//     <div>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
//         <input
//           placeholder="Search tickets..."
//           className="search-bar"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={{ flex: 1, marginRight: 8, padding: "6px 8px" }}
//         />
//         <button className="refresh" onClick={fetchTickets} style={{ padding: "6px 12px" }}>
//           🔄 Refresh
//         </button>
//       </div>

//       <table style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr>
//             {["ID", "Customer", "Category", "Question", "Status", "Reply", "Confidence", "Action"].map(
//               (h) => (
//                 <th key={h} style={{ borderBottom: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
//                   {h}
//                 </th>
//               )
//             )}
//           </tr>
//         </thead>
//         <tbody>
//           {filtered.map((t) => (
//             <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
//               <td style={{ padding: "8px" }}>{t.id}</td>
//               <td style={{ padding: "8px" }}>{t.customer}</td>
//               <td style={{ padding: "8px" }}>{t.category}</td>
//               <td style={{ padding: "8px" }}>{t.question}</td>
//               <td
//                 style={{
//                   padding: "8px",
//                   fontWeight: "bold",
//                   color:
//                     t.status === "Resolved"
//                       ? "green"
//                       : t.status === "Created"
//                       ? "blue"
//                       : "orange",
//                 }}
//               >
//                 {t.status}
//               </td>
//               <td style={{ padding: "8px" }}>{t.currentReply}</td>
//               <td style={{ padding: "8px" }}>{formatConfidence(t.confidence)}</td>
//               <td style={{ padding: "8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
//                 {(t.status === "Created" || t.status === "Pending") && (
//                   <>
//                     {t.originalBotReply && (
//                       <button
//                         className="action-btn"
//                         onClick={() => handleResolve({ ...t, acceptBotClicked: true })}
//                       >
//                         Accept Bot
//                       </button>
//                     )}
//                     <button className="action-btn" onClick={() => handleResolve(t, true)}>
//                       Manual Resolve
//                     </button>
//                     <button className="action-btn secondary" onClick={() => handleDelete(t.id)}>
//                       Delete
//                     </button>
//                   </>
//                 )}
//                 {t.status === "Resolved" && (
//                   <>
//                     <button
//                       className="action-btn ghost"
//                       onClick={() =>
//                         fetch(`${apiUrl}/tickets/${t.id}/status`, {
//                           method: "POST",
//                           headers: { "Content-Type": "application/json" },
//                           body: JSON.stringify({ status: "Pending" }),
//                         }).then(() => fetchTickets())
//                       }
//                     >
//                       Change Status
//                     </button>
//                     <button className="action-btn secondary" onClick={() => handleDelete(t.id)}>
//                       Delete
//                     </button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";

// export default function TicketTable({ apiUrl }) {
//   const [tickets, setTickets] = useState([]);
//   const [search, setSearch] = useState("");

//   // Fetch tickets from backend
//   const fetchTickets = async () => {
//     const res = await fetch(`${apiUrl}/tickets`);
//     const data = await res.json();

//     // Normalize fields for frontend
//     const updated = data.map((t) => ({
//       ...t,
//       strand_id: t.strand_id ?? t.strandId ?? "",
//       originalBotReply: t.originalBotReply ?? t.botReply ?? "",
//       originalBotConfidence: t.originalBotConfidence ?? t.confidence ?? 0.0,
//       currentReply: t.currentReply ?? t.botReply ?? "",
//     }));

//     setTickets(updated);
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   // Resolve ticket
//   const handleResolve = async (ticket, manual = false) => {
//     let replyToSend;
//     let confidenceToSend;

//     if (!manual && ticket.acceptBotClicked) {
//       // Accept Bot → backend handles AI query
//       replyToSend = ticket.currentReply; // keep old value until backend responds
//       confidenceToSend = ticket.confidence || 0.0;
//     } else if (manual) {
//       // Manual resolve
//       const reply = prompt("Enter manual reply:", ticket.currentReply || "");
//       if (!reply) return;
//       replyToSend = reply;
//       confidenceToSend = 1.0;
//     } else {
//       // Default bot resolve
//       replyToSend = ticket.botReply;
//       confidenceToSend = ticket.confidence || ticket.originalBotConfidence || 0.0;
//     }

//     // Send resolve status to backend
//     const res = await fetch(`${apiUrl}/tickets/${ticket.id}/resolve`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         reply: replyToSend,
//         agent: !manual ? "bot" : "human",
//         confidence: confidenceToSend,
//         status: "Resolved",
//         issue_text: ticket.question,
//         strandId: ticket.strand_id,
//       }),
//     });

//     if (res.ok) {
//       // Fetch updated ticket from backend to get AI reply
//       const updatedRes = await fetch(`${apiUrl}/tickets`);
//       const data = await updatedRes.json();
//       const updatedTicket = data.find((t) => t.id === ticket.id);

//       if (updatedTicket) {
//         setTickets((prev) =>
//           prev.map((t) =>
//             t.id === ticket.id
//               ? {
//                   ...t,
//                   currentReply: updatedTicket.botReply, // updated bot reply
//                   confidence: updatedTicket.confidence,
//                   status: updatedTicket.status,
//                   acceptBotClicked: false,
//                 }
//               : t
//           )
//         );
//       }
//     }
//   };

//   // Delete ticket
//   const handleDelete = async (id) => {
//     if (!confirm(`Delete ticket ${id}?`)) return;
//     await fetch(`${apiUrl}/tickets/${id}`, { method: "DELETE" });
//     fetchTickets();
//   };

//   // Filter tickets by search
//   const filtered = tickets.filter((t) =>
//     t.question.toLowerCase().includes(search.toLowerCase())
//   );

//   // Format confidence
//   const formatConfidence = (t) => {
//     let c = t.confidence != null && t.confidence > 0 ? t.confidence : t.originalBotConfidence || 0.0;
//     if (c <= 1) c = c * 100; // fraction → %
//     return c.toFixed(1) + "%";
//   };

//   return (
//     <div>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
//         <input
//           placeholder="Search tickets..."
//           className="search-bar"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={{ flex: 1, marginRight: 8, padding: "6px 8px" }}
//         />
//         <button className="refresh" onClick={fetchTickets} style={{ padding: "6px 12px" }}>
//           🔄 Refresh
//         </button>
//       </div>

//       <table style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr>
//             {["ID", "Customer", "Category", "Question", "Status", "Reply", "Confidence", "Action"].map(
//               (h) => (
//                 <th key={h} style={{ borderBottom: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
//                   {h}
//                 </th>
//               )
//             )}
//           </tr>
//         </thead>
//         <tbody>
//           {filtered.map((t) => (
//             <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
//               <td style={{ padding: "8px" }}>{t.id}</td>
//               <td style={{ padding: "8px" }}>{t.customer}</td>
//               <td style={{ padding: "8px" }}>{t.category}</td>
//               <td style={{ padding: "8px" }}>{t.question}</td>
//               <td
//                 style={{
//                   padding: "8px",
//                   fontWeight: "bold",
//                   color:
//                     t.status === "Resolved"
//                       ? "green"
//                       : t.status === "Created" || t.status === "Partially Resolved"
//                       ? "blue"
//                       : "orange",
//                 }}
//               >
//                 {t.status}
//               </td>
//               <td style={{ padding: "8px" }}>{t.currentReply}</td>
//               <td style={{ padding: "8px" }}>{formatConfidence(t)}</td>
//               <td style={{ padding: "8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
//                 {(t.status === "Created" || t.status === "Pending" || t.status === "Partially Resolved") && (
//                   <>
//                     {t.originalBotReply && (
//                       <button
//                         className="action-btn"
//                         onClick={() => handleResolve({ ...t, acceptBotClicked: true })}
//                       >
//                         Accept Bot
//                       </button>
//                     )}
//                     <button className="action-btn" onClick={() => handleResolve(t, true)}>
//                       Manual Resolve
//                     </button>
//                     <button className="action-btn secondary" onClick={() => handleDelete(t.id)}>
//                       Delete
//                     </button>
//                   </>
//                 )}
//                 {t.status === "Resolved" && (
//                   <>
//                     <button
//                       className="action-btn ghost"
//                       onClick={() =>
//                         fetch(`${apiUrl}/tickets/${t.id}/status`, {
//                           method: "POST",
//                           headers: { "Content-Type": "application/json" },
//                           body: JSON.stringify({ status: "Pending" }),
//                         }).then(() => fetchTickets())
//                       }
//                     >
//                       Change Status
//                     </button>
//                     <button className="action-btn secondary" onClick={() => handleDelete(t.id)}>
//                       Delete
//                     </button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }





// import React, { useEffect, useState } from "react";

// export default function TicketTable({ apiUrl, role }) {
//   const [tickets, setTickets] = useState([]);
//   const [search, setSearch] = useState("");

//   // Fetch tickets from backend
//   const fetchTickets = async () => {
//     const res = await fetch(`${apiUrl}/tickets`);
//     const data = await res.json();

//     // Normalize fields for frontend
//     const updated = data.map((t) => ({
//       ...t,
//       strand_id: t.strand_id ?? t.strandId ?? "",
//       originalBotReply: t.originalBotReply ?? t.botReply ?? "",
//       originalBotConfidence: t.originalBotConfidence ?? t.confidence ?? 0.0,
//       currentReply: t.currentReply ?? t.botReply ?? "",
//     }));

//     setTickets(updated);
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   // Resolve ticket
//   const handleResolve = async (ticket, manual = false) => {
//     let replyToSend;
//     let confidenceToSend;

//     if (!manual && ticket.acceptBotClicked) {
//       replyToSend = ticket.currentReply;
//       confidenceToSend = ticket.confidence || 0.0;
//     } else if (manual) {
//       const reply = prompt("Enter manual reply:", ticket.currentReply || "");
//       if (!reply) return;
//       replyToSend = reply;
//       confidenceToSend = 1.0;
//     } else {
//       replyToSend = ticket.botReply;
//       confidenceToSend = ticket.confidence || ticket.originalBotConfidence || 0.0;
//     }

//     const res = await fetch(`${apiUrl}/tickets/${ticket.id}/resolve`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         reply: replyToSend,
//         agent: !manual ? "bot" : "human",
//         confidence: confidenceToSend,
//         status: "Resolved",
//         issue_text: ticket.question,
//         strandId: ticket.strand_id,
//       }),
//     });

//     if (res.ok) {
//       const updatedRes = await fetch(`${apiUrl}/tickets`);
//       const data = await updatedRes.json();
//       const updatedTicket = data.find((t) => t.id === ticket.id);

//       if (updatedTicket) {
//         setTickets((prev) =>
//           prev.map((t) =>
//             t.id === ticket.id
//               ? {
//                   ...t,
//                   currentReply: updatedTicket.botReply,
//                   confidence: updatedTicket.confidence,
//                   status: updatedTicket.status,
//                   acceptBotClicked: false,
//                 }
//               : t
//           )
//         );
//       }
//     }
//   };

//   // Delete ticket
//   const handleDelete = async (id) => {
//     if (!confirm(`Delete ticket ${id}?`)) return;
//     await fetch(`${apiUrl}/tickets/${id}`, { method: "DELETE" });
//     fetchTickets();
//   };

//   // Filter tickets by search
//   const filtered = tickets.filter((t) =>
//     t.question.toLowerCase().includes(search.toLowerCase())
//   );

//   // Format confidence
//   const formatConfidence = (t) => {
//     let c = t.confidence != null && t.confidence > 0 ? t.confidence : t.originalBotConfidence || 0.0;
//     if (c <= 1) c = c * 100;
//     return c.toFixed(1) + "%";
//   };

//   return (
//     <div>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
//         <input
//           placeholder="Search tickets..."
//           className="search-bar"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={{ flex: 1, marginRight: 8, padding: "6px 8px" }}
//         />
//         <button className="refresh" onClick={fetchTickets} style={{ padding: "6px 12px" }}>
//           🔄 Refresh
//         </button>
//       </div>

//       <table style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr>
//             {["ID", "Customer", "Category", "Question", "Status", "Reply", "Confidence", "Action"].map(
//               (h) => (
//                 <th key={h} style={{ borderBottom: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
//                   {h}
//                 </th>
//               )
//             )}
//           </tr>
//         </thead>
//         <tbody>
//           {filtered.map((t) => (
//             <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
//               <td style={{ padding: "8px" }}>{t.id}</td>
//               <td style={{ padding: "8px" }}>{t.customer}</td>
//               <td style={{ padding: "8px" }}>{t.category}</td>
//               <td style={{ padding: "8px" }}>{t.question}</td>
//               <td
//                 style={{
//                   padding: "8px",
//                   fontWeight: "bold",
//                   color:
//                     t.status === "Resolved"
//                       ? "green"
//                       : t.status === "Created" || t.status === "Partially Resolved"
//                       ? "blue"
//                       : "orange",
//                 }}
//               >
//                 {t.status}
//               </td>
//               <td style={{ padding: "8px" }}>{t.currentReply}</td>
//               <td style={{ padding: "8px" }}>{formatConfidence(t)}</td>
//               <td style={{ padding: "8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
//                 {role === "ADMIN" && (t.status === "Created" || t.status === "Pending" || t.status === "Partially Resolved") && (
//                   <>
//                     {t.originalBotReply && (
//                       <button
//                         className="action-btn"
//                         onClick={() => handleResolve({ ...t, acceptBotClicked: true })}
//                       >
//                         Accept Bot
//                       </button>
//                     )}
//                     <button className="action-btn" onClick={() => handleResolve(t, true)}>
//                       Manual Resolve
//                     </button>
//                     <button className="action-btn secondary" onClick={() => handleDelete(t.id)}>
//                       Delete
//                     </button>
//                   </>
//                 )}
//                 {role === "ADMIN" && t.status === "Resolved" && (
//                   <>
//                     <button
//                       className="action-btn ghost"
//                       onClick={() =>
//                         fetch(`${apiUrl}/tickets/${t.id}/status`, {
//                           method: "POST",
//                           headers: { "Content-Type": "application/json" },
//                           body: JSON.stringify({ status: "Pending" }),
//                         }).then(() => fetchTickets())
//                       }
//                     >
//                       Change Status
//                     </button>
//                     <button className="action-btn secondary" onClick={() => handleDelete(t.id)}>
//                       Delete
//                     </button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }












// auth-service + download report
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function TicketTable({ apiUrl, role }) {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch tickets from backend
  const fetchTickets = async () => {
    const res = await fetch(`${apiUrl}/tickets`);
    const data = await res.json();

    const updated = data.map((t) => ({
      ...t,
      strand_id: t.strand_id ?? t.strandId ?? "",
      originalBotReply: t.originalBotReply ?? t.botReply ?? "",
      originalBotConfidence: t.originalBotConfidence ?? t.confidence ?? 0.0,
      currentReply: t.currentReply ?? t.botReply ?? "",
    }));

    setTickets(updated);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Resolve ticket
  const handleResolve = async (ticket, manual = false) => {
    let replyToSend;
    let confidenceToSend;

    if (!manual && ticket.acceptBotClicked) {
      replyToSend = ticket.currentReply;
      confidenceToSend = ticket.confidence || 0.0;
    } else if (manual) {
      const reply = prompt("Enter manual reply:", ticket.currentReply || "");
      if (!reply) return;
      replyToSend = reply;
      confidenceToSend = 1.0;
    } else {
      replyToSend = ticket.botReply;
      confidenceToSend = ticket.confidence || ticket.originalBotConfidence || 0.0;
    }

    const res = await fetch(`${apiUrl}/tickets/${ticket.id}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: replyToSend,
        agent: !manual ? "bot" : "human",
        confidence: confidenceToSend,
        status: "Resolved",
        issue_text: ticket.question,
        strandId: ticket.strand_id,
      }),
    });

    if (res.ok) fetchTickets();
  };

  // Delete ticket
  const handleDelete = async (id) => {
    if (!confirm(`Delete ticket ${id}?`)) return;
    await fetch(`${apiUrl}/tickets/${id}`, { method: "DELETE" });
    fetchTickets();
  };

  // Download Excel file (Admin)
  const handleDownloadExcel = () => {
    const wsData = tickets.map((t) => ({
      ID: t.id,
      Customer: t.customer,
      Category: t.category,
      Question: t.question,
      Status: t.status,
      Reply: t.currentReply,
      Confidence:
        (t.confidence && t.confidence > 1 ? t.confidence : (t.confidence || 0) * 100).toFixed(1) + "%",
    }));

    const worksheet = XLSX.utils.json_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `Tickets_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Filter tickets by search
  const filtered = tickets.filter((t) =>
    t.question.toLowerCase().includes(search.toLowerCase())
  );

  // Format confidence
  const formatConfidence = (t) => {
    let c = t.confidence != null && t.confidence > 0 ? t.confidence : t.originalBotConfidence || 0.0;
    if (c <= 1) c = c * 100;
    return c.toFixed(1) + "%";
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <input
          placeholder="Search tickets..."
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, marginRight: 8, padding: "6px 8px" }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button className="refresh" onClick={fetchTickets} style={{ padding: "6px 12px" }}>
            🔄 Refresh
          </button>
          {role === "ADMIN" && (
            <button className="refresh" onClick={handleDownloadExcel} style={{ padding: "6px 12px" }}>
              📊 Download Report
            </button>
          )}
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["ID", "Customer", "Category", "Question", "Status", "Reply", "Confidence"].map(
              (h) => (
                <th key={h} style={{ borderBottom: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
                  {h}
                </th>
              )
            )}
            {role === "ADMIN" && (
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filtered.map((t) => (
            <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px" }}>{t.id}</td>
              <td style={{ padding: "8px" }}>{t.customer}</td>
              <td style={{ padding: "8px" }}>{t.category}</td>
              <td style={{ padding: "8px" }}>{t.question}</td>
              <td style={{
                  padding: "8px",
                  fontWeight: "bold",
                  color:
                    t.status === "Resolved"
                      ? "green"
                      : t.status === "Created" || t.status === "Partially Resolved"
                      ? "blue"
                      : "orange",
                }}>
                {t.status}
              </td>
              <td style={{ padding: "8px" }}>{t.currentReply}</td>
              <td style={{ padding: "8px" }}>{formatConfidence(t)}</td>

              {role === "ADMIN" && (
                <td style={{ padding: "8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(t.status === "Created" || t.status === "Pending" || t.status === "Partially Resolved") && (
                    <>
                      {t.originalBotReply && (
                        <button className="action-btn" onClick={() => handleResolve({ ...t, acceptBotClicked: true })}>
                          Accept Bot
                        </button>
                      )}
                      <button className="action-btn" onClick={() => handleResolve(t, true)}>
                        Manual Resolve
                      </button>
                      <button className="action-btn secondary" onClick={() => handleDelete(t.id)}>
                        Delete
                      </button>
                    </>
                  )}
                  {t.status === "Resolved" && (
                    <>
                      <button className="action-btn ghost" onClick={() =>
                        fetch(`${apiUrl}/tickets/${t.id}/status`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "Pending" }),
                        }).then(() => fetchTickets())
                      }>
                        Change Status
                      </button>
                      <button className="action-btn secondary" onClick={() => handleDelete(t.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
