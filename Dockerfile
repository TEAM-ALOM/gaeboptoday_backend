FROM node:20-alpine

ENV DATABASE_URL=postgresql://postgres:postgres@database:5432/gaeboptoday?schema=public

WORKDIR /usr/src/app

RUN mkdir -p /workspace/.pnpm-store
RUN chown -R 1001:1001 /workspace/.pnpm-store

COPY package*.json/ ./

RUN npm install -g pnpm
RUN corepack enable
RUN corepack enable npm

RUN pnpm i
RUN npm install -g @nestjs/cli

RUN npx prisma generate

RUN pnpm build