FROM node:12

WORKDIR /0b0t_kitbot

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node" "."]