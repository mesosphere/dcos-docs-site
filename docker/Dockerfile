#
# Build
#

FROM node:8.1.2-slim as builder

RUN apt-get update -qq && apt-get install -y build-essential

RUN mkdir /src
VOLUME ['/src']
WORKDIR /src
ADD . /src/

RUN npm install -g bootprint
RUN npm install -g bootprint-openapi
RUN npm install -g ngindox

RUN make clean
RUN make swagger
RUN make ngindox

RUN npm install
RUN npm run build

RUN pwd
RUN ls ./

#
# Nginx
#

FROM nginx:latest

ARG nginx_conf

RUN mkdir /src
WORKDIR /src
COPY --from=builder /src/build   .
ADD "$nginx_conf" /etc/nginx/conf.d/default.conf
RUN service nginx restart

EXPOSE 80
EXPOSE 443
