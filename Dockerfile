FROM node:alpine

WORKDIR /root
ADD build /root

RUN yarn add global serve

EXPOSE 5000
CMD yarn serve /root -l tcp://0.0.0.0:5000
