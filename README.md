## Description

Lab 1

## Deployment

Application contains 2 parts:

Front:
```bash
$ npm i
$ npm run start
```

API:
```bash
$ npm i
$ npm run prisma:migrate:deploy
$ npm run prisma:generate
$ npm run start:dev
```