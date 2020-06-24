FROM node:12.18.1-alpine3.12

RUN mkdir /src
WORKDIR /src
ADD . /src/

RUN npm install
