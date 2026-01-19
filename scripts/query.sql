SELECT url, device, performance, accessibility, "bestPractices", seo 
FROM "LighthouseReport" 
ORDER BY "createdAt" DESC 
LIMIT 5;
