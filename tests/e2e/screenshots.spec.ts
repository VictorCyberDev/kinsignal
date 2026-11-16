import {test,expect} from "@playwright/test";
import {mkdirSync} from "node:fs";
test("capture reproducible synthetic product screenshots",async({page})=>{
 mkdirSync("evidence/screenshots",{recursive:true});
 await page.setViewportSize({width:1440,height:1000});
 await page.goto("/");
 await expect(page.getByRole("heading",{name:/When something doesn.t feel right/})).toBeVisible();
 await page.screenshot({path:"evidence/screenshots/01-home.png",fullPage:true});
 await page.getByRole("button",{name:/Someone wants my login code/}).click();
 await page.getByRole("button",{name:"Assess the situation"}).click();
 await expect(page.getByRole("heading",{name:"Your action plan"})).toBeVisible();
 await page.screenshot({path:"evidence/screenshots/02-assessment-and-actions.png",fullPage:true});
 await page.goto("/atlas");await page.screenshot({path:"evidence/screenshots/03-global-safety-atlas.png",fullPage:true});
 await page.goto("/learn");await page.screenshot({path:"evidence/screenshots/04-safety-learning.png",fullPage:true});
 await page.goto("/verify");await page.getByLabel("URL to examine").fill("https://login.example.org/check");await page.getByRole("button",{name:"Review without visiting"}).click();await page.screenshot({path:"evidence/screenshots/05-independent-url-review.png",fullPage:true});
 await page.goto("/checkup");await page.screenshot({path:"evidence/screenshots/06-privacy-checkup.png",fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.goto("/");await page.screenshot({path:"evidence/screenshots/07-mobile-home.png",fullPage:true});
});
