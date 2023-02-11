FROM node:16-alpine as builder

WORKDIR /var/lib/app/
COPY . .

# ARG PUBLIC_URL
ARG ENV_TYPE

RUN yarn install
RUN yarn build:${ENV_TYPE}

FROM nginx:1.17.7-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /var/lib/app/build/ /var/www/
