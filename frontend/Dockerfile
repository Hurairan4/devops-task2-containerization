# Stage 1: Build optimized React assets
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --no-audit --no-fund

COPY index.html ./
COPY src ./src

RUN npm run build

# Stage 2: Lightweight Nginx runtime
FROM nginx:stable-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
