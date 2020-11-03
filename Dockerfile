FROM node:12-alpine

WORKDIR /root
ADD . /root

RUN npm ci && npm run build && rm -rf /root/pages && rm -rf /root/node_modules && rm -rf /root/.git

RUN npm install http-server
EXPOSE 5000
CMD npx http-server -a 0.0.0.0 -p 5000 /root/build
