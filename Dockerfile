FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install nodemon -g

EXPOSE 8080
CMD [ "nodemon", "-L", "server/src/server.js" ]