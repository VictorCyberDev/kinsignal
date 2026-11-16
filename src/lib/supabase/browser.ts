import {createBrowserClient} from "@supabase/ssr";
import type {SupabaseClient} from "@supabase/supabase-js";
let client:SupabaseClient | null=null;
export function isCloudConfigured():boolean{return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);}
export function getBrowserSupabase():SupabaseClient {
 if(!isCloudConfigured())throw new Error("Cloud accounts are not configured. The guest demo remains available.");
 if(!client)client=createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
 return client;
}
