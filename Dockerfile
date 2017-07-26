FROM node:6.11.0-slim

RUN apt-get update -qq && apt-get install -y build-essential

RUN mkdir /src

WORKDIR /src
ADD package.json /src/package.json
RUN npm install

EXPOSE 3000