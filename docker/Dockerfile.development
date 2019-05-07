FROM nginx:latest

ARG nginx_dir

RUN mkdir -p /src/build

WORKDIR /src/build

ADD "$nginx_dir" /etc/nginx/conf.d

RUN service nginx restart

EXPOSE 80
EXPOSE 443
