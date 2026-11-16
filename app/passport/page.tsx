"use client";
import {useState} from "react";
type Preferences={language:string;country:string;highContrast:boolean;largeText:boolean;reducedMotion:boolean;retention:"session"|"explicitLocal"};
const defaults:Preferences={language:"en",country:"",highContrast:false,largeText:false,reducedMotion:false,retention:"session"};
const key="kinsignal-public-preferences-v1";
export default function Passport(){
 const [p,setP]=useState<Preferences>(defaults),[message,setMessage]=useState("");
 function save(){
  try{if(p.retention==="explicitLocal"){localStorage.setItem(key,JSON.stringify(p));setMessage("Preferences saved in this browser. Anyone with access to this browser may be able to read them.");}else{localStorage.removeItem(key);setMessage("Session-only preferences selected; no local copy saved.");}}catch{setMessage("Browser storage unavailable. Settings remain in this page only.");}
 }
 function load(){try{const raw=localStorage.getItem(key);if(!raw){setMessage("No saved browser preferences found.");return;}const value=JSON.parse(raw);if(typeof value.language==="string"&&typeof value.country==="string"){setP({...defaults,...value});setMessage("Preferences loaded from this browser.");}else setMessage("Saved preferences are invalid.");}catch{setMessage("Could not load browser preferences.");}}
 function reset(){localStorage.removeItem(key);setP(defaults);setMessage("Local preferences cleared.");}
 return <main className="shell" style={{fontSize:p.largeText?"1.15rem":undefined,filter:p.highContrast?"contrast(1.3)":undefined}}>
 <header className="top"><a href="/" className="logo">✳ KinSignal</a><a href="/">← Return to safety case</a></header>
 <section className="intro"><p className="eyebrow">SAFETY PASSPORT</p><h1>Comfort and control, without a profile.</h1><p className="lead">Choose optional preferences without sharing sensitive information. This form does not infer identity or vulnerabilities.</p></section>
 <section className="panel"><label htmlFor="language">Preferred language</label><select id="language" value={p.language} onChange={e=>setP({...p,language:e.target.value})}><option value="en">English — reviewed baseline</option></select><p>Additional languages are withheld until critical safety content receives review.</p>
 <label htmlFor="passport-country">Country (optional)</label><input id="passport-country" value={p.country} onChange={e=>setP({...p,country:e.target.value.slice(0,80)})} placeholder="Leave blank if you prefer"/>
 <label><input type="checkbox" style={{width:"auto"}} checked={p.highContrast} onChange={e=>setP({...p,highContrast:e.target.checked})}/> Increase contrast for this page</label>
 <label><input type="checkbox" style={{width:"auto"}} checked={p.largeText} onChange={e=>setP({...p,largeText:e.target.checked})}/> Larger text on this page</label>
 <label><input type="checkbox" style={{width:"auto"}} checked={p.reducedMotion} onChange={e=>setP({...p,reducedMotion:e.target.checked})}/> Prefer reduced motion</label>
 <label htmlFor="retention">Preference retention</label><select id="retention" value={p.retention} onChange={e=>setP({...p,retention:e.target.value as Preferences["retention"]})}><option value="session">Session only (no saved copy)</option><option value="explicitLocal">Opt in to saving in this browser</option></select>
 <p className="caution">If this is a shared or monitored device, saved browser preferences could be observable. This is not secure storage for private cases.</p>
 <div style={{display:"flex",gap:12,flexWrap:"wrap"}}><button className="primary" onClick={save}>Apply preference choice</button><button className="secondary" onClick={load}>Load browser preferences</button><button className="secondary" onClick={reset}>Delete saved preferences</button></div>{message&&<p role="status">{message}</p>}</section></main>;
}
