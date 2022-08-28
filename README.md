# 簡易公文自動生產機
## How to run

Fill the values in the `.env.example` and rename it to `.env`

Note: shadow database is not necessary if your database allows you to drop tables (ex: Heroku's postgres can't, hence the need for it), see [this](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database#cloud-hosted-shadow-databases-must-be-created-manually) prisma doc for details

```bash
yarn install
```

Then do

```bash
yarn dev
```

The website is now running on `localhost:3000`
