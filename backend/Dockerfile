# Stage 1: Dependencies
FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev --no-audit --no-fund

# Stage 2: Production Runtime
FROM node:22-alpine AS runtime

ENV NODE_ENV=production

WORKDIR /app

COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node server.js ./

USER node

EXPOSE 3000

CMD ["node", "server.js"]
