FROM node:14.15.5-alpine3.13

# set working directory
WORKDIR /code

ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json package-lock.json ./

RUN npm install --silent
