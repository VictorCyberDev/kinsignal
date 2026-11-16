import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("guest concern -> assessment -> completed action -> reassessment -> receipt",async({page})=>{
 await page.goto("/");
 await expect(page.getByRole("heading",{name:/When something doesn.t feel right/})).toBeVisible();
 await page.getByLabel("Short title").fill("Synthetic bank OTP request");
 await page.getByLabel("What happened?").fill("A caller asked me to share my OTP to unlock my account.");
 await page.getByRole("button",{name:"Assess the situation"}).click();
 await expect(page.getByText("One-time code requested")).toBeVisible();
 await expect(page.getByRole("heading",{name:"Your action plan"})).toBeVisible();
 await page.getByRole("button",{name:"Mark complete"}).first().click();
 await page.getByLabel("Updated description").fill("A caller asked me to share my OTP and give my password to unlock my account.");
 await page.getByRole("button",{name:"Update and reassess"}).click();
 await expect(page.getByText("Credential disclosure request")).toBeVisible();
 await expect(page.getByText(/2 assessment\(s\) preserved/)).toBeVisible();
 await expect(page.getByRole("button",{name:"Export decision receipt (JSON)"})).toBeVisible();
});
test("atlas country selector remains honest about coverage",async({page})=>{
 await page.goto("/atlas");
 await expect(page.getByText(/Federal Trade Commission/)).toBeVisible();
 await page.getByLabel("Country").selectOption("SG");
 await expect(page.getByText(/ScamShield/)).toBeVisible();
 await page.getByLabel("Country").selectOption("JP");
 await expect(page.getByText(/National Police Agency/)).toBeVisible();
});
test("learning provides explanations with no secret inputs",async({page})=>{
 await page.goto("/learn");
 await page.getByLabel("End the call and contact the bank independently").check();
 await expect(page.getByText("Appropriate protective choice.")).toBeVisible();
});
test("public guest interface has no serious automated axe violations",async({page})=>{
 await page.goto("/");
 const results=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
 expect(results.violations).toEqual([]);
});
test("mobile guest journey remains usable",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/");
 await expect(page.getByRole("button",{name:"Assess the situation"})).toBeVisible();
 await page.getByLabel("Short title").fill("Synthetic request");
 await page.getByLabel("What happened?").fill("A person asked me to send my OTP.");
 await page.getByRole("button",{name:"Assess the situation"}).click();
 await expect(page.getByRole("heading",{name:"Your action plan"})).toBeVisible();
});
