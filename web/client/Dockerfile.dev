FROM node:12.12.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --prod

COPY . .

CMD ["npm", "start"]