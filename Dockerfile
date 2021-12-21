FROM node:16

WORKDIR /usr/src/api

COPY api/ ./

RUN npm install

RUN npm run build

EXPOSE 8080

CMD ["node", "dist/index.js"]