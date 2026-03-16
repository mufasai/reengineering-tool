
# === BASE IMAGE UNTUK BUILD & DEV ===
FROM node:23 AS build
WORKDIR /app
COPY . .

# Install dependencies
RUN npm install

RUN cd /app
RUN npm run build

# === STAGE PRODUCTION (NGINX) ===
FROM nginx:1.27.4-alpine-slim AS prod

# Bersihkan konfigurasi default
RUN rm /etc/nginx/conf.d/default.conf

# Copy konfigurasi custom (jika ada)
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy hasil build dari stage build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
