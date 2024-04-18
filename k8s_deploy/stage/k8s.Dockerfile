### STAGE 1: Build ###
FROM node:20-alpine as build
RUN apk add git

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --immutable --immutable-cache
#RUN npm install -g typescript

COPY . .
RUN npm run build:dev

### STAGE 2: Run ###
FROM nginx
COPY ./k8s_deploy/stage/uat-nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build/ /usr/share/nginx/html/