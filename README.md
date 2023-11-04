# Matchdays

Matchdays is a small web platform that allows you to select your favorite football clubs (it's not called soccer!) and display their matchday dates in your google calendar, thereby eliminating the need to put these manually in (huge pain for me...).

The app is built using the T3-Stack (Next.js, tRPC, Tailwind, TypeScript). The matchday data is scraped via Cheerio and Axios (source: OneFootball) and stored in a Postgres Database, addressed via Prisma as the ORM.
