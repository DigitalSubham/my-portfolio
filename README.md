This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## DSA Practice Data

The quiz at `/dsa-practice.html` loads its complete question bank from
`/api/practice/dsa/questions` once, then handles questions, navigation, answers,
explanations, filters, review and scoring in the browser.

Run `npm run db:practice` with `DATABASE_URL` configured to create the practice
tables and import the original 1,044 questions. The import preserves existing
database edits and saved sessions. `db/seeds/dsa-questions.json` is the initial
import source; the running quiz reads the database, not that file.

Sign in with the existing portfolio admin account to save across devices.
**Save progress** writes a checkpoint containing the ordered question IDs,
current position, answers, topic statistics and remaining test time. Questions
and navigation do not trigger individual API calls. Browser recovery stays
local until Save is pressed; confirmed **Reset progress** also saves the reset.
An older tab cannot overwrite a newer checkpoint without loading it first.

`npm run test:practice` checks checkpoint validation and the imported bank.

`node tests/practice-browser.mjs` runs the full save/resume workflow against a
running development server using Playwright and Chrome. It creates a temporary
test account and removes it with its saved data afterward. Set
`PLAYWRIGHT_MODULE` to a Playwright module path if it is not installed locally.
