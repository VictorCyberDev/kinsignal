/** Offline-only URL interpretation; NEVER performs DNS, fetch or sender identity verification. */
export type UrlReview={accepted:boolean;hostname:string|null;signals:string[];limitations:string[]};
export function reviewUrl(input:string):UrlReview {
 const limitations=["This check is a text-level URL review only.","No URL was visited, reputation provider consulted, or domain ownership verified.","A URL without these indicators is not necessarily safe."];
 if(input.length>2048)return {accepted:false,hostname:null,signals:["URL too long to review"],limitations};
 let url:URL;
 try{url=new URL(input.trim());}catch{return {accepted:false,hostname:null,signals:["Invalid URL syntax"],limitations};}
 if(!["http:","https:"].includes(url.protocol))return {accepted:false,hostname:null,signals:["Unsupported URL scheme"],limitations};
 const signals:string[]=[];
 if(url.protocol==="http:")signals.push("The connection scheme is not HTTPS.");
 if(url.username||url.password)signals.push("The URL includes embedded user information.");
 if(url.hostname.includes("xn--"))signals.push("The domain includes encoded internationalized characters; review the spelling.");
 if(/^(?:\d{1,3}\.){3}\d{1,3}$/.test(url.hostname)||url.hostname.startsWith("["))signals.push("The URL uses an IP address rather than a familiar domain.");
 if(url.hostname.split(".").length>=5)signals.push("The hostname contains several nested subdomains.");
 if(url.port&&!["80","443"].includes(url.port))signals.push("The URL uses a nonstandard port.");
 if(url.searchParams.size>8)signals.push("The URL contains many query parameters.");
 return {accepted:true,hostname:url.hostname,signals,limitations};
}
