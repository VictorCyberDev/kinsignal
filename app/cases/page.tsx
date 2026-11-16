"use client";
import {useEffect,useState} from "react";
import {getBrowserSupabase,isCloudConfigured} from "../../src/lib/supabase/browser";
import {createCase,evaluateCase,type SafetyCase,type Category} from "../../src/safety/engine";
type StoredCase={id:string;title:string;category:Category;case_payload:SafetyCase;updated_at:string};
export default function Cases(){
 const [userId,setUserId]=useState<string|null>(null),[list,setList]=useState<StoredCase[]>([]),[message,setMessage]=useState(""),[title,setTitle]=useState(""),[description,setDescription]=useState(""),[category,setCategory]=useState<Category>("message"),[busy,setBusy]=useState(false);
 const configured=isCloudConfigured();
 async function refresh(){
  const client=getBrowserSupabase();
  const {data:{user},error:authError}=await client.auth.getUser();
  if(authError||!user){setUserId(null);setList([]);return;}
  setUserId(user.id);
  const {data,error}=await client.from("ks_cases").select("id,title,category,case_payload,updated_at").order("updated_at",{ascending:false}).limit(50);
  if(error)setMessage(error.message);else setList((data||[]) as StoredCase[]);
 }
 useEffect(()=>{if(configured){void refresh();}},[configured]);
 async function save(){
  if(!userId)return;setBusy(true);setMessage("");
  try{
    const c=evaluateCase(createCase({title,description,category}));
    const client=getBrowserSupabase();
    const {error}=await client.from("ks_cases").insert({id:c.id,owner_id:userId,title:c.title,category:c.category,case_payload:c,version:c.revision});
    if(error)throw error;setDescription("");setTitle("");await refresh();setMessage("Case saved in your private account.");
  }catch(e){setMessage(e instanceof Error?e.message:"Save failed.");}
  finally{setBusy(false);}
 }
 async function remove(id:string){
  if(!confirm("Delete this stored case? This cannot be undone."))return;
  const {error}=await getBrowserSupabase().from("ks_cases").delete().eq("id",id);
  if(error)setMessage(error.message);else {setMessage("Case deleted.");await refresh();}
 }
 return <main className="shell"><header className="top"><a href="/" className="logo">✳ KinSignal</a><a href="/account">Account</a></header>
 <section className="intro"><p className="eyebrow">MY SAFETY CASES</p><h1>A private place to follow up.</h1><p className="lead">Registered case storage depends on a configured KinSignal database and verified ownership policies.</p></section>
 {!configured?<section className="panel"><p>Cloud case storage is not configured. Use the guest assessment on the home page instead.</p></section>:!userId?<section className="panel"><p>Sign in to access private cases. <a href="/account">Go to account</a>.</p></section>:<><section className="panel"><h2>Start a private case</h2><p>Do not include passwords, one-time codes, or sensitive evidence.</p><label htmlFor="caseTitle">Title</label><input id="caseTitle" value={title} maxLength={120} onChange={e=>setTitle(e.target.value)}/><label htmlFor="caseCategory">Category</label><select id="caseCategory" value={category} onChange={e=>setCategory(e.target.value as Category)}>{(["message","account","payment","privacy","recovery"] as Category[]).map(c=><option key={c}>{c}</option>)}</select><label htmlFor="caseDescription">Description</label><textarea id="caseDescription" value={description} maxLength={5000} onChange={e=>setDescription(e.target.value)} rows={4}/><button className="primary" disabled={busy||!title.trim()||!description.trim()} onClick={()=>void save()}>Save private case</button></section>
 <section className="panel"><h2>Saved cases</h2>{list.length?list.map(c=><article key={c.id}><h3>{c.title}</h3><p>{c.category} · last updated {new Date(c.updated_at).toLocaleString()}</p><p>{c.case_payload.assessments.at(-1)?.summary||"Assessment unavailable"}</p><button className="secondary" onClick={()=>void remove(c.id)}>Delete case</button><hr/></article>):<p>No stored cases found.</p>}</section>{message&&<p role="status">{message}</p>}</>}
 </main>;
}
