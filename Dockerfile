FROM node:11.11.0
RUN npm cache clean --force
RUN npm set registry https://registry.npm.taobao.org
RUN npm install -g pm2
COPY package.json /app/
COPY package-lock.json /app/
WORKDIR /app
RUN  npm install
COPY . /app  
RUN npm run generate
RUN node deploy.js