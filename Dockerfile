## 참고
# https://kr.vuejs.org/v2/cookbook/dockerize-vuejs-app.html

###  for Build  ###
FROM node:12-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app
COPY package.json yarn.lock ./

# install dependencies
RUN yarn config set "strict-ssl" false
RUN yarn add @nuxtjs/axios
RUN yarn --frozen-lockfile

# build application
COPY . .
# RUN yarn lint
RUN yarn build
RUN yarn export

###  for Production  ###
FROM nginx:1.18.0-alpine
# for SPA (try_files)
COPY default.conf /etc/nginx/conf.d/default.conf

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/dist /usr/share/nginx/html