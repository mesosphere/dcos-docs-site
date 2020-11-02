FROM node:alpine

WORKDIR /root
ADD . /root

RUN npm ci && npm run build && rm -rf /root/pages && rm -rf /root/node_modules && rm -rf /root/.git

RUN npm install serve
EXPOSE 5000
CMD npx serve /root/build -l tcp://0.0.0.0:5000
