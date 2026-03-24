##
## Nxellent Frontend – multi-stage Vite build → Nginx static serve
##

# ---------- build stage ----------
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# API URL is baked in at build time (Vite inlines env vars)
ARG VITE_API_URL=https://api.nxellent.com
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------- runtime stage ----------
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
