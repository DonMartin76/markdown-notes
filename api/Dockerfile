FROM node:6-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app

EXPOSE 3100

CMD ["npm", "start"]
