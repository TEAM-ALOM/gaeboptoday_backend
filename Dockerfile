# build stage
FROM node:20-alpine as builder

WORKDIR /usr/src/app

RUN mkdir -p /workspace/.pnpm-store && \
    chown -R 1001:1001 /workspace/.pnpm-store

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm i

COPY . .

RUN npx prisma generate

RUN pnpm build

# run stage
FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

ENV DATABASE_URL=postgresql://postgres:postgres@database:5432/gaeboptoday?schema=public