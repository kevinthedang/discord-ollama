# use node LTS image for version 18
FROM node:hydrogen-alpine

# set working directory inside container
WORKDIR /app

# copy package.json and the lock file into the container, and src files
COPY ./src ./src
COPY ./*.json ./
COPY ./.env ./

# install dependencies, breaks
RUN npm install

# build the typescript code
RUN npm run build

# start the application
CMD ["npm", "run", "prod"]
