FROM node:10.16.0
RUN npm cache clean --force
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install -g pm2
COPY package.json /app/
WORKDIR /app
RUN npm install
COPY . /app
RUN npm run build

FROM nginx
COPY --from=0 /app/build /app
COPY --from=0 /app/nginx.conf /etc/nginx/nginx.conf