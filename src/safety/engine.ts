/**
 * KinSignal deterministic safety engine: no AI, outbound requests or implicit identity verification.
 * This is not a professional emergency service and does not claim to prove fraud.
 */
export type Category = "message" | "account" | "payment" | "privacy" | "recovery";
export type EvidenceKind = "USER_REPORTED" | "SYSTEM_OBSERVED" | "RULE_INFERRED" | "EXTERNALLY_VERIFIED" | "UNKNOWN" | "CONTRADICTED";
export type CaseStatus = "CREATED" | "ASSESSED" | "ACTION_IN_PROGRESS" | "RECOVERY" | "RESOLVED";
export type ActionStatus = "NOT_STARTED" | "IN_PROGRESS" | "USER_CONFIRMED_COMPLETE" | "NEEDS_REVIEW";
export type Indicator = { id:string; title:string; explanation:string; provenance:EvidenceKind };
export type Action = {id:string; title:string; reason:string; status:ActionStatus; priority:number};
export type Assessment = {id:string; version:string; at:string; indicators:Indicator[]; unknowns:string[]; summary:string; limitations:string[]};
export type CaseEvent = {id:string; at:string; type:string; detail:string};
export type SafetyCase = {id:string; title:string; country:string; category:Category; description:string; status:CaseStatus; revision:number; assessments:Assessment[]; actions:Action[]; events:CaseEvent[]; createdAt:string; updatedAt:string};
const stamp = () => new Date().toISOString();
const identifier = () => crypto.randomUUID();
const version = "rules-0.1.0";
type Rule = {id:string; title:string; explanation:string; pattern:RegExp; action:string; reason:string; priority:number};
const rules:Rule[] = [
 {id:"otp",title:"One-time code requested",explanation:"The description includes a request for a one-time verification code.",pattern:/\b(otp|one[- ]time (pass(word|code)|pin)|verification code)\b.{0,100}\b(send|share|tell|give|forward)\b|\b(send|share|tell|give|forward)\b.{0,100}\b(otp|one[- ]time (pass(word|code)|pin)|verification code)\b/i,action:"Do not share authentication codes",reason:"One-time codes may allow an attacker to access an account.",priority:1},
 {id:"password",title:"Credential disclosure request",explanation:"The description suggests someone is asking for a password.",pattern:/\b(send|share|give|tell|enter|provide)\b.{0,90}\b(password|login credentials|passcode)\b/i,action:"Use the service's independently opened official website",reason:"Avoid entering credentials through an unverified request.",priority:1},
 {id:"payment",title:"Unusual payment demand",explanation:"The description combines a payment demand with a suspicious pressure signal.",pattern:/\b(pay|payment|transfer|wire|fee|gift card|crypto)\b.{0,100}\b(now|immediately|urgent|today|avoid arrest|release|unlock)\b|\b(urgent|immediately|avoid arrest)\b.{0,100}\b(pay|payment|transfer|fee)\b/i,action:"Pause payment and verify the request independently",reason:"Pressure-based payment requests deserve independent checks.",priority:2},
 {id:"remote",title:"Remote access requested",explanation:"The description includes a request to install or grant remote access.",pattern:/\b(anydesk|teamviewer|remote access|screen share|share your screen)\b/i,action:"Do not grant remote access to an unverified requester",reason:"Remote access can expose private information and accounts.",priority:1},
 {id:"link",title:"Unsolicited link with verification request",explanation:"The description combines a link with a verification or account demand.",pattern:/\bhttps?:\/\/\S+.{0,120}\b(verify|sign in|login|confirm|account)\b|\b(verify|sign in|login|confirm)\b.{0,120}\bhttps?:\/\/\S+/i,action:"Open the official service independently, not through the supplied link",reason:"A lookalike link is not reliable evidence of identity.",priority:2}
];
const recoveryActions:Record<"account"|"payment"|"privacy"|"recovery",Action[]> = {
 account:[{id:"account-secure",title:"Review account sessions and recovery settings",reason:"If access may be compromised, use a trusted device and the service's independently opened official interface.",priority:1,status:"NOT_STARTED"}],
 payment:[{id:"payment-contact",title:"Contact the financial provider through its official channel",reason:"Ask about reporting a suspected transaction promptly. No refund is guaranteed.",priority:1,status:"NOT_STARTED"}],
 privacy:[{id:"privacy-check",title:"Review sharing and permission settings on a safe device",reason:"Check whether changes could alert anyone monitoring your device; do not assume KinSignal can scan permissions.",priority:1,status:"NOT_STARTED"}],
 recovery:[{id:"recovery-plan",title:"Identify and secure the affected service",reason:"Use an independently verified official contact channel, document a limited timeline and ask for relevant recovery options.",priority:1,status:"NOT_STARTED"}]
};
const generalActions:Action[]=[
 {id:"independent-check",title:"Verify through a channel you found independently",reason:"Do not rely on contact details provided in the suspicious message.",priority:2,status:"NOT_STARTED"},
 {id:"document",title:"Record a brief, redacted timeline",reason:"Keep only the information needed for follow-up. Never include passwords or one-time codes.",priority:3,status:"NOT_STARTED"}
];
function sanitiseInput(s:string):string {
 return s.replace(/\b\d{4,8}\b(?=\s*(?:is my|otp|code))/gi,"[redacted]").slice(0,5000);
}
function actionFromRule(rule:Rule):Action {return {id:"rule-"+rule.id,title:rule.action,reason:rule.reason,priority:rule.priority,status:"NOT_STARTED"};}
export function assess(description:string,category:Category="message"):Omit<Assessment,"id"|"at"> & {suggestedActions:Action[]} {
 const hits=rules.filter(rule=>rule.pattern.test(description));
 const indicators=hits.map(rule=>({id:rule.id,title:rule.title,explanation:rule.explanation,provenance:"RULE_INFERRED" as const}));
 const suggestedActions=[...hits.map(actionFromRule),...(category==="message"?[]:recoveryActions[category]),...generalActions].sort((a,b)=>a.priority-b.priority);
 const summary=hits.length ? "Potential warning signals were identified. This does not establish that the request is fraudulent." : "No matching warning pattern was found. This does not establish that the situation is safe.";
 return {version,indicators,summary,suggestedActions,unknowns:["The actual identity of the sender or caller","Whether any account or money was affected","The legitimacy of the underlying request"],limitations:["Assessment is based on the description provided, not external identity verification.","Rule matches are contextual warning signals, not proof of harm.","No link was opened, device scanned or institution contacted."]};
}
export function createCase(input:{title:string;category:Category;country?:string;description:string}):SafetyCase {
 if(!input.title.trim() || !input.description.trim())throw new Error("A title and description are required.");
 const now=stamp();const id=identifier();
 const safeDescription=sanitiseInput(input.description);
 return {id,title:input.title.trim().slice(0,120),category:input.category,country:input.country||"Unspecified",description:safeDescription,status:"CREATED",revision:0,assessments:[],actions:[],events:[{id:identifier(),at:now,type:"CASE_CREATED",detail:"User created a guest safety case."}],createdAt:now,updatedAt:now};
}
export function evaluateCase(c:SafetyCase):SafetyCase {
 const a=assess(c.description,c.category), now=stamp();
 const prior=new Map(c.actions.map(action=>[action.id,action]));
 const actions=a.suggestedActions.map(action=>({...action,status:prior.get(action.id)?.status??"NOT_STARTED" as ActionStatus}));
 const disappeared=c.actions.filter(action=>!actions.some(x=>x.id===action.id) && action.status==="USER_CONFIRMED_COMPLETE").map(action=>({...action,status:"NEEDS_REVIEW" as const}));
 return {...c,status:"ASSESSED",revision:c.revision+1,updatedAt:now,actions:[...actions,...disappeared],assessments:[...c.assessments,{id:identifier(),at:now,version:a.version,indicators:a.indicators,unknowns:a.unknowns,summary:a.summary,limitations:a.limitations}],events:[...c.events,{id:identifier(),at:now,type:"ASSESSED",detail:"New deterministic assessment recorded; historical assessments preserved."}]};
}
export function updateCase(c:SafetyCase,description:string):SafetyCase {
 if(!description.trim())throw new Error("Description cannot be empty.");
 const now=stamp();
 return evaluateCase({...c,description:sanitiseInput(description),updatedAt:now,events:[...c.events,{id:identifier(),at:now,type:"USER_UPDATED_DESCRIPTION",detail:"Case description updated; past assessments preserved."}]});
}
export function markAction(c:SafetyCase,actionId:string,status:ActionStatus):SafetyCase {
 if(!c.actions.some(a=>a.id===actionId))throw new Error("Unknown action.");
 const now=stamp();
 return {...c,status:"ACTION_IN_PROGRESS",revision:c.revision+1,updatedAt:now,actions:c.actions.map(a=>a.id===actionId?{...a,status}:a),events:[...c.events,{id:identifier(),at:now,type:"ACTION_USER_UPDATED",detail:actionId+" marked "+status+" by user; not system verified."}]};
}
export function receipt(c:SafetyCase) {
 const latest=c.assessments.at(-1);
 return {receiptId:identifier(),caseId:c.id,createdAt:stamp(),assessmentVersion:latest?.version||null,userReportedDescription:c.description,matchedIndicators:latest?.indicators||[],unknowns:latest?.unknowns||[],recommendedActions:c.actions.map(a=>({title:a.title,status:a.status})),limitations:latest?.limitations||[],provenance:"Guest-generated decision record; not legal certification, external verification or proof of truth."};
}

/** Timeline only: notes are user-reported and never independent evidence of an external event. */
export function addCaseNote(c:SafetyCase,note:string):SafetyCase {
 const clean=sanitiseInput(note).trim();
 if(!clean || clean.length>1500)throw new Error("A note of up to 1,500 characters is required.");
 const now=stamp();
 return {...c,revision:c.revision+1,updatedAt:now,events:[...c.events,{id:identifier(),at:now,type:"USER_REPORTED_NOTE",detail:clean}]};
}
/** User-controlled minimal-share summary. Calling this does not send or deliver anything. */
export function makeSupportSummary(c:SafetyCase):string {
 const latest=c.assessments.at(-1);
 const warnings=latest?.indicators.map(i=>i.title).join("; ")||"No matched warning indicators";
 return ["KinSignal support request (prepared by user; not automatically delivered)",
   "Case type: "+c.category,
   "Possible warning signals: "+warnings,
   "Suggested next action: "+(c.actions[0]?.title||"Verify through a trusted independent channel"),
   "No private case description, location, evidence or credentials included.",
   "Please reply only if you freely choose to help."].join("\n");
}
