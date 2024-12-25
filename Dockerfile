FROM node:20

WORKDIR /0b0t_kitbot

COPY package*.json ./

RUN npm install
ADD .env

COPY . .

CMD ["node", "--env-file=.env", "index.js"]