# Base image
FROM node:lts-alpine as builder

# Create app directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

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
