# Base image
FROM node:18-alpine as builder

# Create app directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@latest-7

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./
RUN pnpm fetch

ADD . ./
RUN pnpm install -r --offline

# Loads env values from ./.env.dockercompose
RUN pnpm build --mode dockercompose

# TODO: NGINX doesn't work well with vue-router. Fix this later.
# FROM nginx:1.25-alpine

# # Copy healthcheck script
# COPY --from=builder /app/additional_scripts/healthcheck.mjs ./healthcheck.mjs
# COPY --from=builder /app/dist /usr/share/nginx/html

HEALTHCHECK CMD node ./healthcheck.mjs

# Expose port 57200
EXPOSE 57200

# TODO: This should be changed later to a NGINX image
# Start the app
CMD ["pnpm", "preview", "--port", "57200", "--host"]
