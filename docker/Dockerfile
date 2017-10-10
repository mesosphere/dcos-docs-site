#
# Build MS PDF
#

FROM node:8.1.2-slim as ms-pdf-builder

RUN apt-get update -qq && apt-get install -y build-essential

RUN mkdir /src
VOLUME ['/src']
WORKDIR /src
ADD . /src/

RUN npm install -g bootprint
RUN npm install -g bootprint-openapi
RUN npm install -g ngindox
RUN npm install

RUN make build-swagger
RUN make build-ngindox
RUN npm run build-pdf

#
# Build PDF
#

FROM openlabs/docker-wkhtmltopdf-aas:latest as pdf-builder

RUN mkdir -p /tmp/pdf

WORKDIR /tmp/pdf
COPY --from=ms-pdf-builder /src ./

RUN make build-pdf

#
# Build MS
#

FROM ms-pdf-builder as ms-builder

WORKDIR /src

RUN npm run build

#
# Nginx
#

FROM nginx:latest

ARG nginx_dir

RUN mkdir -p /src/build
RUN mkdir -p /src/build-pdf

WORKDIR /src/build
COPY --from=ms-builder /src/build ./

WORKDIR /src/build-pdf
COPY --from=pdf-builder /tmp/pdf/build-pdf ./

ADD "$nginx_dir" /etc/nginx/conf.d

RUN service nginx restart

EXPOSE 80
EXPOSE 443
