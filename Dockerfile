FROM node:16

WORKDIR /usr/src/api

COPY api/package*.json ./

RUN npm install

COPY api/ ./

RUN npm run build

EXPOSE 8080

CMD ["node", "dist/index.js"]