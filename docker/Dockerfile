FROM node:gallium-buster-slim

RUN mkdir /dcos-docs-site
WORKDIR /dcos-docs-site

COPY package* /dcos-docs-site/

RUN npm install --legacy-peer-deps

COPY . /dcos-docs-site/

ENTRYPOINT [ "npm", "run", "dev" ]

EXPOSE 3000/tcp
EXPOSE 35729/tcp
