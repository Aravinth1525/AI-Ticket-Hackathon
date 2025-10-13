import React, {useEffect, useState} from 'react';
import { backendHealth, aiHealth } from '../api';

export default function HealthPanel(){
  const [backend, setBackend] = useState({status:"?"});
  const [ai, setAi] = useState({status:"?"});

  useEffect(()=> {
    async function load(){
      setBackend(await backendHealth());
      setAi(await aiHealth());
    }
    load();
    const iv = setInterval(load, 5000);
    return ()=>clearInterval(iv);
  },[]);

  return (
    <div style={{display:'flex', gap:20}}>
      <div>Backend: <b style={{color: backend.status === "UP" ? "green":"red"}}>{backend.status}</b></div>
      <div>AI Service: <b style={{color: ai.status === "UP" ? "green":"red"}}>{ai.status}</b></div>
    </div>
  );
}
