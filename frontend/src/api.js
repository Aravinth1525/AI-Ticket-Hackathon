import axios from 'axios';

// Ensure base URL has no trailing slash to avoid double-slash in paths
const RAW_BACKEND = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
const BACKEND = RAW_BACKEND.replace(/\/+$/,'');

export const createTicket = (payload) => axios.post(`${BACKEND}/tickets`, payload).then(r=>r.data);
export const listTickets = () => axios.get(`${BACKEND}/tickets`).then(r=>r.data);
export const resolveTicket = (id, payload) => axios.post(`${BACKEND}/tickets/${id}/resolve`, payload).then(r=>r.data);
export const deleteTicket = (id) => axios.delete(`${BACKEND}/tickets/${id}`).then(r=>r.data);

// health check endpoints (admin & AI)
export const backendHealth = () => axios.get("http://localhost:8080/actuator/health").then(r=>r.data).catch(()=>({status:"DOWN"}));
export const aiHealth = () => axios.get("http://localhost:8000/health").then(r=>r.data).catch(()=>({status:"DOWN"}));
