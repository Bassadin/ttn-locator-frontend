# Base image
FROM node:lts-alpine AS base

ENV NODE_ENV=production

# Create app directory
WORKDIR /app

RUN apk update && apk add --no-cache libc6-compat=1.2.3-r4
RUN corepack enable && corepack prepare pnpm@8.2.0 --activate

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./
RUN pnpm fetch

ADD . ./
RUN pnpm install -r --offline

RUN pnpm build

EXPOSE 3000

# Health check
HEALTHCHECK CMD node ./additional_scripts/healthcheck.mjs

# Run
CMD [ "node", "dist/index.js" ]