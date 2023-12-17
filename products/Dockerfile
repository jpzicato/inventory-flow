FROM node:18.17.1

WORKDIR /products

COPY .babelrc ./
COPY package.json ./
COPY src ./src

RUN npm install
RUN npm run build

COPY wait-for-it.sh ./
COPY entrypoint.sh ./

RUN chmod +x ./wait-for-it.sh
RUN chmod +x ./entrypoint.sh

CMD ./entrypoint.sh
