FROM node:12.14.0

# Create app directory
WORKDIR /usr/src/app

# Set environment
ENV NODE_ENV production
ENV PORT 5000
ENV LOG_LEVEL debug
ENV API_PREFIX /api

# Install app dependencies
COPY package*.json ./

COPY .babelrc ./
COPY yarn.lock ./
COPY src ./src

RUN ["yarn", "install", "--ignore-optional"]

EXPOSE 5000

CMD ["yarn", "start"]