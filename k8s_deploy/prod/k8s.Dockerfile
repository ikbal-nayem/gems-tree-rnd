### STAGE 1: Build ###
FROM node:18-alpine as build

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build:prod

### STAGE 2: Run ###
FROM nginx
COPY ./k8s_deploy/prod/prod-nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build/ /usr/share/nginx/html/