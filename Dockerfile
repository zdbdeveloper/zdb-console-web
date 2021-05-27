# build stage
FROM node:12-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app
COPY package*.json ./

# install dependencies
RUN npm install --production

# build application
COPY . .
RUN npm run generate

###  for Production  ###
FROM nginx:1.18.0-alpine
# for SPA (try_files)
# COPY default.conf /etc/nginx/conf.d/default.conf

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]