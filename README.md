# How to setup dev environment

### Setting up Redis and Postgres Database

Run the following command (Make sure docker is installed on your machine):

```sh
docker compose -f docker-compose-yml up -d
```
This will start a docker instance for postgres and redis

### Setup Database

```sh
cd .\packages\db

yarn
```
Create .env and copy .env.example into ./packages/db/prisma/.env

```sh
yarn db:push
```


### Setup env variables, install all packages, setup the prisma and build the backend

Use git bash for below command
```bash
cd ..
cd ..
yarn dev:setup
```

### Develop

To develop all apps and packages, run the following command:

```bash
yarn run dev
```
### Production

To run the app on production, run the following commands:

```bash
yarn run prod
```