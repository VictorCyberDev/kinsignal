import test from "node:test";
import assert from "node:assert/strict";
import {reviewUrl} from "../src/safety/url.ts";
test("rejects dangerous non-web schemes",()=>assert.equal(reviewUrl("file:///etc/passwd").accepted,false));
test("rejects invalid input",()=>assert.equal(reviewUrl("not a link").accepted,false));
test("an IP host is an indicator not a verdict",()=>{const r=reviewUrl("http://127.0.0.1/login");assert.ok(r.signals.some(s=>s.includes("IP address")));assert.ok(r.limitations.some(s=>s.includes("not necessarily safe")));});
test("benign HTTPS URL is not certified safe",()=>{const r=reviewUrl("https://example.org");assert.equal(r.accepted,true);assert.equal(r.signals.length,0);assert.ok(r.limitations.length>0);});
