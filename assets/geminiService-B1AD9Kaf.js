var L=Object.defineProperty;var M=(e,t,r)=>t in e?L(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var i=(e,t,r)=>M(e,typeof t!="symbol"?t+"":t,r);var A;(function(e){e.STRING="string",e.NUMBER="number",e.INTEGER="integer",e.BOOLEAN="boolean",e.ARRAY="array",e.OBJECT="object"})(A||(A={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var N;(function(e){e.LANGUAGE_UNSPECIFIED="language_unspecified",e.PYTHON="python"})(N||(N={}));var _;(function(e){e.OUTCOME_UNSPECIFIED="outcome_unspecified",e.OUTCOME_OK="outcome_ok",e.OUTCOME_FAILED="outcome_failed",e.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded"})(_||(_={}));var c;(function(e){e.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",e.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",e.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",e.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",e.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",e.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY"})(c||(c={}));var O;(function(e){e.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",e.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",e.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",e.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",e.BLOCK_NONE="BLOCK_NONE"})(O||(O={}));var u;(function(e){e.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",e.NEGLIGIBLE="NEGLIGIBLE",e.LOW="LOW",e.MEDIUM="MEDIUM",e.HIGH="HIGH"})(u||(u={}));var d;(function(e){e.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",e.SAFETY="SAFETY",e.OTHER="OTHER"})(d||(d={}));var a;(function(e){e.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",e.STOP="STOP",e.MAX_TOKENS="MAX_TOKENS",e.SAFETY="SAFETY",e.RECITATION="RECITATION",e.LANGUAGE="LANGUAGE",e.BLOCKLIST="BLOCKLIST",e.PROHIBITED_CONTENT="PROHIBITED_CONTENT",e.SPII="SPII",e.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",e.OTHER="OTHER"})(a||(a={}));var C;(function(e){e.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",e.RETRIEVAL_QUERY="RETRIEVAL_QUERY",e.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",e.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",e.CLASSIFICATION="CLASSIFICATION",e.CLUSTERING="CLUSTERING"})(C||(C={}));var T;(function(e){e.MODE_UNSPECIFIED="MODE_UNSPECIFIED",e.AUTO="AUTO",e.ANY="ANY",e.NONE="NONE"})(T||(T={}));var l;(function(e){e.MODE_UNSPECIFIED="MODE_UNSPECIFIED",e.MODE_DYNAMIC="MODE_DYNAMIC"})(l||(l={}));var R;(function(e){e.GENERATE_CONTENT="generateContent",e.STREAM_GENERATE_CONTENT="streamGenerateContent",e.COUNT_TOKENS="countTokens",e.EMBED_CONTENT="embedContent",e.BATCH_EMBED_CONTENTS="batchEmbedContents"})(R||(R={}));a.RECITATION,a.SAFETY,a.LANGUAGE;const E=class E{constructor(){i(this,"genAI",null);i(this,"model",null)}static getInstance(){return E.instance||(E.instance=new E),E.instance}async analyzeLogo(t,r){if(!this.model)return this.getMockAnalysis(r);try{const n=`
                Analyze logo for "${r}". Identify trademark risks, copyright issues, or visual mimics of famous brands.
                Return JSON schema: { "isSafe": boolean, "riskLevel": "Low"|"Medium"|"High", "similarBrands": string[], "message": string }
            `,s=await this.fileToGenerativePart(t),I=await(await this.model.generateContent([n,s])).response;return JSON.parse(I.text())}catch(n){return console.error("AI Analysis Failed:",n),{isSafe:!1,riskLevel:"Medium",message:"Intelligence gathering interrupted. Proceed with caution."}}}async analyzeFraudReport(t){if(!this.model)return{severity:"Medium",urgency:5,summary:"AI node offline. Standard classification applied."};try{const r=`
                Analyze this fraud report: "${t.description}". 
                Rate severity based on financial impact, public safety, and evidence strength.
                Return JSON schema: { "severity": "Low"|"Medium"|"High"|"Critical", "urgency": number(1-10), "summary": string }
            `,s=await(await this.model.generateContent(r)).response;return JSON.parse(s.text())}catch{return{severity:"High",urgency:7,summary:"Automated risk flag raised due to processing error."}}}async getChatResponse(t,r){if(!this.genAI)return"AI node offline. Standard automated response applied.";try{return(await(await this.genAI.getGenerativeModel({model:"gemini-2.0-flash"}).startChat({history:r,systemInstruction:`
                    You are the TrustReg TN Assistant (MBNR Platform).
                    Your purpose is to help citizens and merchants in Tamil Nadu, India.
                    The platform uses HMAC-SHA256 signed QR codes and Haversine geofencing (200m threshold) to prevent business fraud.
                    
                    Rules:
                    1. Be official, polite, and helpful.
                    2. Support both English and Tamil (தமிழ்). If asked in Tamil, reply in Tamil.
                    3. If asked about registration: Explain that merchants need a unique logo (checked by AI), shop location, and contact details.
                    4. If asked about "Location Mismatch": Explain it's a security feature ensuring the shop is where it claims to be.
                    5. If asked about "Expired": Explain QR codes refresh every 30 seconds for security.
                    6. Never provide legal advice, but summarize platform rules.
                    7. Keep responses concise and formatted with markdown.
                `}).sendMessage(t)).response).text()}catch(n){return console.error("Chat Failed:",n),"Communication node disrupted. Please try again shortly."}}async fileToGenerativePart(t){return{inlineData:{data:await new Promise(n=>{const s=new FileReader;s.onloadend=()=>n(s.result.split(",")[1]),s.readAsDataURL(t)}),mimeType:t.type}}}getMockAnalysis(t){const n=["starbucks","a2b","dominos","kfc"].some(s=>t.toLowerCase().includes(s));return{isSafe:!n,riskLevel:n?"High":"Low",similarBrands:n?["Famous Brand Mimic"]:[],message:n?"High similarity to protected trademark identified.":"Brand signature appears unique."}}};i(E,"instance");let o=E;const p=o.getInstance();export{p as a};
