# Use official node image (https://hub.docker.com/_/node/)
FROM node:11.2.0-alpine

MAINTAINER David Antunes <dvdantunes@gmail.com>

# Default env variables
ENV NODE_ENV=production
ENV PORT=4040

# Create app directory in container and set it as working directory
RUN mkdir -p /app
WORKDIR /app

# Create logs directory
RUN mkdir -p /app/logs

# Only copy package.json initially so that `RUN yarn` layer is recreated only
# if there are changes in package.json
ADD package.json yarn.lock /app/

# --pure-lockfile: Don’t generate a yarn.lock lockfile
RUN yarn --production --pure-lockfile

# Copy all file from current dir to /app in container
COPY . /app/

# Expose port 4040
EXPOSE 4040

# Command to start service
CMD yarn start
