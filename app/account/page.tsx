"use client";
import {useEffect,useState} from "react";
import {getBrowserSupabase,isCloudConfigured} from "../../src/lib/supabase/browser";
export default function Account(){
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[message,setMessage]=useState(""),[user,setUser]=useState<string|null>(null),[busy,setBusy]=useState(false);
 const configured=isCloudConfigured();
 useEffect(()=>{if(!configured)return;const client=getBrowserSupabase();void client.auth.getUser().then(({data})=>setUser(data.user?.email||null));const {data:{subscription}}=client.auth.onAuthStateChange((_event,session)=>setUser(session?.user.email||null));return()=>subscription.unsubscribe();},[configured]);
 async function act(action:"signIn"|"signUp"|"signOut"){
  if(!configured)return;setBusy(true);setMessage("");const auth=getBrowserSupabase().auth;
  try{
   const res=action==="signOut"?await auth.signOut():action==="signIn"?await auth.signInWithPassword({email,password}):await auth.signUp({email,password});
   if(res.error)throw res.error;
   setMessage(action==="signUp"?"Check your email if confirmation is required, then sign in.":action==="signOut"?"Signed out.":"Signed in.");
   setPassword("");
  }catch(e){setMessage(e instanceof Error?e.message:"Authentication failed.");}
  finally{setBusy(false);}
 }
 return <main className="shell"><header className="top"><a href="/" className="logo">✳ KinSignal</a><a href="/">← Return home</a></header><section className="intro"><p className="eyebrow">REGISTERED ACCOUNTS</p><h1>Your safety, in your control.</h1><p className="lead">Cloud accounts require a dedicated configured KinSignal database. The public guest journey works without one.</p></section>
 <section className="panel">{!configured?<p role="status">Cloud accounts have not been activated in this environment. No account data is being collected.</p>:user?<><h2>Signed in</h2><p>{user}</p><p><a href="/cases">View your private cases</a></p><button className="secondary" disabled={busy} onClick={()=>void act("signOut")}>Sign out</button></>:<><h2>Sign in or create an account</h2><form onSubmit={e=>{e.preventDefault();void act("signIn");}}><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)}/><div style={{display:"flex",gap:12,marginTop:20,flexWrap:"wrap"}}><button className="primary" disabled={busy} type="submit">Sign in</button><button className="secondary" disabled={busy} type="button" onClick={()=>void act("signUp")}>Create account</button></div></form></>}{message&&<p role="status">{message}</p>}</section><p className="caution">Do not use your account password as evidence in a KinSignal safety case.</p></main>;
}
