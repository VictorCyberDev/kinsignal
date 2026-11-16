import {NextResponse} from "next/server";
import {reviewedResources} from "../../../src/content/resources";
export const dynamic="force-dynamic";
export async function GET(){
 const data={
  service:"KinSignal",
  status:"guest_demo_available",
  cloudPersistenceConfigured:Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  verifiedSourceCountries:new Set(reviewedResources.map(x=>x.country)).size,
  deliveryProvider:"inactive",
  externalIdentityVerification:"not_available",
  buildRevision:process.env.VERCEL_GIT_COMMIT_SHA||"not_provided"
 };
 return NextResponse.json(data,{headers:{"Cache-Control":"no-store, max-age=0"}});
}
