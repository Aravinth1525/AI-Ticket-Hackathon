import React, {useState} from 'react';
import { createTicket } from '../api';

export default function TicketForm(){
  const [customer,setCustomer]=useState('');
  const [category,setCategory]=useState('Internet');
  const [question,setQuestion]=useState('');
  const [msg,setMsg]=useState('');

  const submit = async ()=> {
    setMsg("Submitting...");
    try {
      const res = await createTicket({customer,category,question});
      setMsg("Submitted. Status: " + res.status + (res.botReply?(" — reply: "+res.botReply):""));
    } catch(e){ setMsg("Error"); }
    setQuestion('');
  };

  return (
    <div>
      <h3>Submit Ticket</h3>
      <input placeholder="Customer" value={customer} onChange={e=>setCustomer(e.target.value)} /><br/>
      <select value={category} onChange={e=>setCategory(e.target.value)}>
        <option>Internet</option><option>SMS</option><option>Billing</option><option>Voice</option>
      </select><br/>
      <textarea placeholder="Describe issue" value={question} onChange={e=>setQuestion(e.target.value)} rows={6} cols={40}/>
      <br/>
      <button onClick={submit}>Submit</button>
      <div>{msg}</div>
    </div>
  );
}
