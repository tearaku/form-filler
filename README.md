# 簡易公文自動生產機
## How to run

Fill the values in the `.env.example` and rename it to `.env`
- `BACKEND_SECRET` & `NEXTAUTH_SECRET`: any random strings
    - See [this](https://next-auth.js.org/configuration/options#secret) for why setting `NEXTAUTH_SECRET` is necessary for prod build (local testing it'll default to a hash of all Nextauth config options)
- `GOOGLE_ID` & `GOOGLE_SECRET`: see [this](https://next-auth.js.org/providers/google) page for details
- `BACKEND_URL`: the URL where the backend is hosted on (ex: `http://localhost:8000"`)
    - This would not be needed if file-generation-related functionalities aren't being tested / used
    - See the repo [here](https://github.com/tearaku/form-filler-backend) for the backend
- `DATABASE_URL`: the DB URL string
- `SHADOW_DATABASE_URL`: see "Note" below
- `NEXTAUTH_URL`: see [here](https://next-auth.js.org/configuration/options#nextauth_url)
    - For local testing, it will be `http://localhost:[PORT]` (by default its on port 3000, thus `http://localhost:3000`)

Note: shadow database is not necessary if your database allows you to drop tables (ex: Heroku's postgres can't, hence the need for it), see [this](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database#cloud-hosted-shadow-databases-must-be-created-manually) prisma doc for details

```bash
yarn install
```

Then do

```bash
yarn dev
```

The website is now running on `localhost:3000`
