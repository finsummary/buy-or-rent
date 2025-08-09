# Dockerfile

# 1. Base Image
FROM node:20-alpine AS base

# 2. Build Stage
FROM base AS build
RUN npm i -g turbo
WORKDIR /app
COPY . .
RUN turbo prune --scope=calculator --docker

# 3. Dependencies Installation
FROM base AS installer
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=build /app/out/json/ .
COPY --from=build /app/out/package-lock.json ./package-lock.json
RUN npm ci

# 4. Runner Stage
FROM base AS runner
WORKDIR /app
COPY --from=installer /app .
COPY --from=build /app/apps/calculator/public /app/apps/calculator/public
COPY --from=build /app/apps/calculator/.next/standalone /app/apps/calculator/.next/standalone
COPY --from=build /app/apps/calculator/.next/static /app/apps/calculator/.next/static

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV=production

CMD ["node", "apps/calculator/server.js"]


