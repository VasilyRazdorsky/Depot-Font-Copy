FROM node:18.15.0-alpine3.16 as build

WORKDIR /code/depot-front/src
COPY package*.json .
RUN npm ci

COPY . .
# If `.env` file is NOT presented - create it and set VITE_BASE_URL
# If `.env` file is presented - don't touch it
RUN [[ ! -f ".env" ]] && echo "VITE_BASE_URL=/" > ".env"; \
  npm run build

FROM caddy:2.6.4-alpine as run

WORKDIR /depot-front

COPY --from=build /code/depot-front/src/dist . 
COPY deploy/Caddyfile /etc/caddy/Caddyfile

EXPOSE 44563

RUN adduser -h /depot-front -s /bin/ash -D -u 2000 caddy && \
  chown -R caddy:caddy /depot-front && \
  chown -R caddy:caddy /config/caddy
USER caddy
