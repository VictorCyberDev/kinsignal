"use client";
import {useState} from "react";
import {lessons} from "../../src/content/lessons";
export default function Learn(){
 const [answers,setAnswers]=useState<Record<string,number>>({});
 return <main className="shell"><header className="top"><a href="/" className="logo">✳ KinSignal</a><a href="/">← Return to safety case</a></header>
 <section className="intro"><p className="eyebrow">PRACTICAL SAFETY LEARNING</p><h1>Practice before it matters.</h1><p className="lead">Short fictional situations help you test protective decisions. No real transactions, external calls, or sensitive data are involved.</p></section>
 {lessons.map(l=><section className="panel" key={l.id}><p className="eyebrow">{l.context}</p><h2>{l.title}</h2><p>{l.prompt}</p><fieldset><legend>Choose one answer</legend>{l.answers.map((answer,i)=><label key={answer} style={{display:"block",padding:"10px 0"}}><input style={{width:"auto",marginRight:"10px"}} type="radio" name={l.id} checked={answers[l.id]===i} onChange={()=>setAnswers({...answers,[l.id]:i})}/>{answer}</label>)}</fieldset>
 {answers[l.id]!==undefined&&<div role="status"><strong>{answers[l.id]===l.correct?"Appropriate protective choice.":"Consider a safer alternative."}</strong><p>{l.explanation}</p></div>}</section>)}
 <p className="caution">Lessons are informational; they do not replace specialist advice or emergency support.</p></main>;
}
