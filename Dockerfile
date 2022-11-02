FROM node:16
EXPOSE 5003
WORKDIR /app
RUN npm install npm@latest -g
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["node","index.js"]