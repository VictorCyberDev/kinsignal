export type Resource = {country:string;name:string;category:string;url:string;source:string;checked:string;coverage:"PARTIALLY_REVIEWED"};
export const reviewedResources:Resource[]=[
 {country:"US",name:"Federal Trade Commission — ReportFraud",category:"Consumer fraud",url:"https://reportfraud.ftc.gov/",source:"https://www.consumerfinance.gov/ask-cfpb/who-do-i-contact-for-help-with-a-scam-or-fraud-en-1777/",checked:"2026-11-16",coverage:"PARTIALLY_REVIEWED"},
 {country:"GB",name:"Report Fraud (England, Wales and Northern Ireland)",category:"Fraud and cybercrime",url:"https://www.reportfraud.police.uk/",source:"https://www.gov.uk/government/news/report-fraud-new-service-from-city-of-london-police",checked:"2026-11-16",coverage:"PARTIALLY_REVIEWED"},
 {country:"CA",name:"Canadian Anti-Fraud Centre",category:"Fraud and cybercrime",url:"https://antifraudcentre-centreantifraude.ca/report-signalez-eng.htm",source:"https://antifraudcentre-centreantifraude.ca/report-signalez-eng.htm",checked:"2026-11-16",coverage:"PARTIALLY_REVIEWED"}
];
export const plannedCountries=[["US","United States"],["GB","United Kingdom"],["CA","Canada"],["AU","Australia"],["IN","India"],["DE","Germany"],["FR","France"],["BR","Brazil"],["NG","Nigeria"],["ZA","South Africa"],["JP","Japan"],["SG","Singapore"]] as const;
