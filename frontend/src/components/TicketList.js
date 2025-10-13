// import React, {useEffect, useState} from 'react';
// import { listTickets, resolveTicket, deleteTicket } from '../api';

// export default function TicketList(){
//   const [tickets,setTickets] = useState([]);
//   const [loading,setLoading]=useState(false);
//   const [replyMap,setReplyMap] = useState({});

//   async function load(){ setLoading(true); const d = await listTickets(); setTickets(d.reverse()); setLoading(false); }
//   useEffect(()=>{ load(); },[]);

//   async function acceptBot(t){
//     // accept bot reply as resolution
//     await resolveTicket(t.id, {reply:t.botReply, agent:"bot", issue_text:t.question});
//     load();
//   }
//   async function manualResolve(t){
//     const reply = replyMap[t.id] || '';
//     if(!reply) return alert("Enter reply below");
//     await resolveTicket(t.id, {reply:reply, agent:"agent", issue_text:t.question});
//     setReplyMap(prev=>({ ...prev, [t.id]: '' }));
//     load();
//   }

//   async function deleteThis(t){
//     if(!confirm('Delete ticket '+t.id+'?')) return;
//     await deleteTicket(t.id);
//     load();
//   }

//   return (
//     <div>
//       <h3>Tickets</h3>
//       {loading?"Loading...":tickets.map(t=>(
//         <div key={t.id} style={{border:'1px solid #ccc', margin:8, padding:8}}>
//           <div><b>{t.customer}</b> — {t.category} — <i>{t.status}</i></div>
//           <div>{t.question}</div>
//           <div style={{color:'green'}}>Bot reply: {t.botReply} (conf: {t.confidence})</div>
//           {t.status !== 'resolved' && <>
//             <div style={{marginTop:8}}>
//               {t.botReply && <button onClick={()=>acceptBot(t)}>Accept Bot Reply</button>}
//               <button style={{marginLeft:8}} onClick={()=>deleteThis(t)}>Delete</button>
//             </div>
//             <div>
//               <input placeholder="manual reply" value={replyMap[t.id]||''} onChange={e=>setReplyMap(prev=>({ ...prev, [t.id]: e.target.value }))}/>
//               <button onClick={()=>manualResolve(t)}>Resolve Manually</button>
//             </div>
//           </>}
//         </div>
//       ))}
//     </div>
//   );
// }























import React, {useEffect, useState} from 'react';
import { listTickets, resolveTicket, deleteTicket } from '../api';

export default function TicketList(){
  const [tickets,setTickets] = useState([]);
  const [loading,setLoading]=useState(false);
  const [replyMap,setReplyMap] = useState({});

  async function load(){ 
    setLoading(true); 
    const d = await listTickets(); 
    setTickets(d.reverse()); 
    setLoading(false); 
  }

  useEffect(()=>{ load(); },[]);

  async function acceptBot(t){
    await resolveTicket(t.id, {reply:t.botReply, agent:"bot", issue_text:t.question});
    load();
  }

  async function manualResolve(t){
    const reply = replyMap[t.id] || '';
    if(!reply) return alert("Enter reply below");
    await resolveTicket(t.id, {reply:reply, agent:"agent", issue_text:t.question});
    setReplyMap(prev=>({ ...prev, [t.id]: '' }));
    load();
  }

  async function deleteThis(t){
    if(!confirm('Delete ticket '+t.id+'?')) return;
    await deleteTicket(t.id);
    load();
  }

  return (
    <div>
      <h3>Tickets</h3>
      {loading ? "Loading..." : tickets.map(t => {
        // Parse and format confidence safely
        const conf = parseFloat(t.confidence || 0).toFixed(1);
        return (
          <div key={t.id} style={{border:'1px solid #ccc', margin:8, padding:8}}>
            <div><b>{t.customer}</b> — {t.category} — <i>{t.status}</i></div>
            <div>{t.question}</div>
            <div style={{color:'green'}}>
              Bot reply: {t.botReply || "(none)"} 
              {t.confidence !== undefined && t.confidence !== null && t.confidence !== '' && (
                <> (conf: {conf}%)</>
              )}
            </div>
            {t.status.toLowerCase() !== 'Resolved' && (
              <>
                <div style={{marginTop:8}}>
                  {t.botReply && <button onClick={()=>acceptBot(t)}>Accept Bot Reply</button>}
                  <button style={{marginLeft:8}} onClick={()=>deleteThis(t)}>Delete</button>
                </div>
                <div>
                  <input
                    placeholder="manual reply"
                    value={replyMap[t.id]||''}
                    onChange={e=>setReplyMap(prev=>({ ...prev, [t.id]: e.target.value }))}
                  />
                  <button onClick={()=>manualResolve(t)}>Resolve Manually</button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
