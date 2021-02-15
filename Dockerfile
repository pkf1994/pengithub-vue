FROM node:12-alpine

RUN mkdir /root/github-trending-api
COPY . /root/github-trending-api
WORKDIR /root/github-trending-api

RUN yarn config set registry https://registry.npm.taobao.org && yarn
CMD yarn start

