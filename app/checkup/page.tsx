"use client";
import {useState} from "react";
const checks=[
 ["mfa","I reviewed whether important accounts use a suitable multi-factor authentication method."],
 ["sessions","I reviewed active sessions from an independently opened official account page."],
 ["recovery","I checked whether recovery methods are current and under my control."],
 ["permissions","I reviewed which applications and websites have access to sensitive permissions."],
 ["sharing","I reviewed location and personal-data sharing on a device I believe is safe."],
 ["backups","I reviewed backup and account recovery options."],
 ["monitoring","I considered whether changing privacy settings could alert someone monitoring the device."]
] as const;
export default function Checkup(){
 const [done,setDone]=useState<Record<string,boolean>>({});
 const count=checks.filter(([id])=>done[id]).length;
 return <main className="shell"><header className="top"><a href="/" className="logo">✳ KinSignal</a><a href="/">← Back to safety case</a></header><section className="intro"><p className="eyebrow">KINSignal PROTECT</p><h1>A privacy checkup on your terms.</h1><p className="lead">Review account and device settings yourself. KinSignal has no access to your devices and cannot verify what you have changed.</p></section><section className="panel"><h2>{count} of {checks.length} self-reviewed</h2><p className="caution">If your device could be monitored, consider whether taking these steps may increase risk. This page cannot hide its presence in browser history or network records.</p>{checks.map(([id,label])=><label key={id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 0"}}><input style={{width:"auto",marginTop:5}} type="checkbox" checked={!!done[id]} onChange={e=>setDone({...done,[id]:e.target.checked})}/><span>{label}</span></label>)}<button className="secondary" onClick={()=>setDone({})}>Clear local checkup</button><p>No personal settings are accessed or stored; choices disappear when this page closes.</p></section></main>;
}
