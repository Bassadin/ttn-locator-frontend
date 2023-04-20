# Base image
FROM node:lts-alpine as builder

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

FROM nginx:alpine

# Copy healthcheck script
COPY --from=builder /app/additional_scripts/healthcheck.mjs ./healthcheck.mjs
COPY --from=builder /app/dist /usr/share/nginx/html

HEALTHCHECK CMD node ./healthcheck.mjs