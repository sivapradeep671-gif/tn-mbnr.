import{s as i}from"./index-CJPx8qpu.js";const r={sendSms:async(e,t)=>(console.warn("[Twilio] Running in MOCK mode. SMS not sent to:",e),!0)},c={sendEmail:async(e,t,s)=>(console.warn("[SendGrid] Running in MOCK mode. Email not sent to:",e),!0)},o={send:async e=>{console.log(`[Notification Authority] Dispatching ${e.type} to recipient...`);let t=!1;if(e.type==="SMS"?t=await r.sendSms(e.to,e.message):t=await c.sendEmail(e.to,e.subject||"TrustReg TN Security Update",e.message),t){const s=e.type==="SMS"?"📱":"📧";i(`${s} ${e.type} dispatched to ${(e.to||"").slice(0,3)}***`,"success")}else i(`Failed to dispatch ${e.type} alert`,"error");return t},alertOwner:async(e,t,s)=>{const n=`TRUSTREG ALERT: Suspicious activity detected for your business "${e}". Reason: ${s}. Please verify your QR signage.`;return o.send({to:t,type:"SMS",message:n})},sendMonthlyReport:async(e,t,s)=>{const n=`
            <h2>TrustReg TN: Monthly Integrity Report</h2>
            <p><strong>Business:</strong> ${t}</p>
            <p><strong>Verified Scans:</strong> ${s.verified}</p>
            <p><strong>Security Flags:</strong> ${s.failed}</p>
            <p>Your business maintains an official integrity status of "EXCELLENT".</p>
        `;return o.send({to:e,type:"EMAIL",subject:`Monthly Report: ${t}`,message:n})}};export{o as n};
