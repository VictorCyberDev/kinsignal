import test from "node:test";
import assert from "node:assert/strict";
import {assess,createCase,evaluateCase,updateCase,markAction,receipt} from "../src/safety/engine.ts";
test("OTP disclosure is a warning, not proof of fraud",()=>{
 const a=assess("Someone asked me to share my OTP to confirm an account.");
 assert.ok(a.indicators.some(x=>x.id==="otp"));
 assert.match(a.summary,/does not establish/);
 assert.ok(a.unknowns.length>0);
});
test("an ordinary neutral message should not be falsely flagged",()=>{
 const a=assess("I will meet my friend at the library tomorrow.");
 assert.equal(a.indicators.length,0);
 assert.match(a.summary,/does not establish that the situation is safe/);
});
test("case revision preserves older assessments and already completed tasks",()=>{
 const first=evaluateCase(createCase({title:"Bank call",category:"message",description:"A caller asked me to share my OTP."}));
 const completed=markAction(first,"rule-otp","USER_CONFIRMED_COMPLETE");
 const revised=updateCase(completed,"A caller asked me to share my OTP and also asked to give my password.");
 assert.equal(revised.assessments.length,2);
 assert.equal(revised.actions.find(x=>x.id==="rule-otp")?.status,"USER_CONFIRMED_COMPLETE");
 assert.ok(revised.assessments[0].indicators.some(x=>x.id==="otp"));
 assert.ok(revised.actions.some(x=>x.id==="rule-password"));
 assert.ok(revised.events.some(x=>x.type==="USER_UPDATED_DESCRIPTION"));
});
test("disappearing completed action becomes review-needed rather than silently dropped",()=>{
 const first=evaluateCase(createCase({title:"Scam call",category:"message",description:"Someone asked me to share my OTP."}));
 const second=markAction(first,"rule-otp","USER_CONFIRMED_COMPLETE");
 const third=updateCase(second,"We only discussed tomorrow's coffee meeting.");
 assert.equal(third.actions.find(x=>x.id==="rule-otp")?.status,"NEEDS_REVIEW");
});
test("receipt does not falsely claim verified truth",()=>{
 const c=evaluateCase(createCase({title:"Message",description:"Please send my OTP.",category:"message"}));
 const r=receipt(c);
 assert.equal(r.caseId,c.id);
 assert.match(r.provenance,/not legal certification/);
});
test("missing descriptions are rejected",()=>assert.throws(()=>createCase({title:"Missing",category:"privacy",description:" "}),/required/));
test("accidentally entered OTP values are removed from stored case descriptions",()=>{
 const c=createCase({title:"Accidental secret",category:"account",description:"My OTP is 123456 and the caller asked me to share it."});
 assert.ok(!c.description.includes("123456"));
 assert.match(c.description,/redacted/);
});
test("long payment card-like numbers are removed from case text",()=>{
 const c=createCase({title:"Card concern",category:"payment",description:"Someone asked for 4111 1111 1111 1111 over the phone."});
 assert.ok(!c.description.includes("4111 1111 1111 1111"));
});
