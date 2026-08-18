# ── Construcción ────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Servicio ────────────────────────────────────────────────────
# nginx sirviendo HTML estático. Nada de `vite preview` en producción.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY seguridad.conf /etc/nginx/seguridad.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
