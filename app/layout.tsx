import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "KinSignal | Safety, when you need it", description: "Make informed decisions about suspicious situations with transparent, case-specific safety guidance." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
