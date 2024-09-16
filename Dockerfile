FROM node:20-bullseye-slim

RUN apt-get update && apt-get install -y procps

WORKDIR /usr/app

RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm i

COPY . .

CMD ["npm", "run", "start:dev"]