# pull official base image
FROM node:12-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
# install app dependencies
RUN npm install 

# add app
COPY . ./

EXPOSE 3000
# start app
CMD ["npm", "start"]