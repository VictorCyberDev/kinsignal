import {createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers";
export async function getServerSupabase(){
 const store=await cookies();
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)throw new Error("Cloud storage is not configured");
 return createServerClient(url,key,{cookies:{
 getAll(){return store.getAll();},
 setAll(items){try{items.forEach(({name,value,options})=>store.set(name,value,options));}catch{/* Render-time cookies cannot be written; middleware refreshes sessions. */}}
 }});
}
