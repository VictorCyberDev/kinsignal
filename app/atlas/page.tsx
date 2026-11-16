"use client";
import {useState} from "react";
import {plannedCountries,reviewedResources} from "../../src/content/resources";
export default function Atlas(){
 const [country,setCountry]=useState("US");
 const resources=reviewedResources.filter(r=>r.country===country);
 return <main className="shell"><header className="top"><a href="/" className="logo">✳ KinSignal</a><a href="/">← Return to safety case</a></header>
 <section className="intro"><p className="eyebrow">GLOBAL SAFETY ATLAS</p><h1>Find an official starting point.</h1><p className="lead">Sources are limited to entries explicitly checked on November 16, 2026. This directory is not comprehensive, and coverage differs by country and region.</p></section>
 <section className="panel"><label htmlFor="country">Country</label><select id="country" value={country} onChange={e=>setCountry(e.target.value)}>{plannedCountries.map(([code,name])=><option key={code} value={code}>{name}</option>)}</select>
 {resources.length?resources.map(r=><article key={r.url}><h2>{r.name}</h2><p>{r.category} · Partially reviewed · Source checked {r.checked}</p><p><a href={r.url} target="_blank" rel="noopener noreferrer">Go to the official reporting website (external)</a></p><p><a href={r.source} target="_blank" rel="noopener noreferrer">Review source and applicability (external)</a></p></article>):<p role="status">No locally reviewed official reporting resource is available for this country yet. Use an independently verified government or law-enforcement website. Do not rely on contact details sent in suspicious messages.</p>}
 <p className="caution">Never send your KinSignal case details automatically to linked services. Requirements and jurisdictional coverage can change; confirm details on each official website.</p></section></main>;
}
