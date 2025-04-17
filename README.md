
# Recalendar

## Run locally

Install packages

`npm install`

Apply all migrations to local sqlite db

`npx drizzle-kit migrate`

Run local server on port 3000

`npm run dev`

## Db migrations

Update schema objects `src\db\schema.ts`

Create new named migration

`npx drizzle-kit generate --name=CUSTOM_NAME`

Apply migrations to local sqlite db

`npx drizzle-kit migrate`

## Notes

- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
- This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
