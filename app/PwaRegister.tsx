"use client";
import {useEffect} from "react";
export default function PwaRegister(){useEffect(()=>{if("serviceWorker" in navigator&&location.protocol==="https:"){void navigator.serviceWorker.register("/sw.js").catch(()=>{/* Offline caching is optional and failure must not affect access. */});}},[]);return null;}
