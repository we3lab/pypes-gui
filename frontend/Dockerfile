FROM node:jod

WORKDIR /app
COPY package*.json ./

COPY . .

RUN npm install 
RUN npm run build

EXPOSE 3333

CMD [ "npm", "run", "start" ]
