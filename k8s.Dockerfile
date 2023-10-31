### STAGE 1: Build ###
FROM node:18-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./
RUN npm install --immutable --immutable-cache

COPY . .
RUN ng build:dev

### STAGE 2: Run ###
FROM nginx
COPY ./k8s_deploy/stage/uat-nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build/ /usr/share/nginx/html/