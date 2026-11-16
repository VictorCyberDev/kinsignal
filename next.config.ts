import type {NextConfig} from "next";
const config:NextConfig={
 async headers(){
  const security=[
   {key:"X-Content-Type-Options",value:"nosniff"},
   {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
   {key:"X-Frame-Options",value:"DENY"},
   {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=()"},
   {key:"X-Permitted-Cross-Domain-Policies",value:"none"}
  ];
  return [{source:"/:path*",headers:security},{source:"/cases/:path*",headers:[{key:"Cache-Control",value:"private, no-store, max-age=0"}]},{source:"/account/:path*",headers:[{key:"Cache-Control",value:"private, no-store, max-age=0"}]}];
 }
};
export default config;
