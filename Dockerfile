FROM node:16
# Create app directory
WORKDIR /root/app/base365-timviec
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source
COPY . .
EXPOSE 6002
CMD [ "node", "docker_server_6002.js" ]