FROM node:11.4.0-alpine

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV production

RUN npm install

COPY ./ ./

EXPOSE 4000

ENV PORT 4000

CMD ["node", "server.js"]
