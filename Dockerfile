FROM node:16 as builder

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install -g prisma

# Install app dependencies
RUN npm install

COPY . ./

# NOT IDEAL, WE SHOULD BE GENERATING ON THE DEPLOY IMAGE BELOW SO WE DONT
# NEED TO FORCE COMPATIBILITY IN SCHEMA FILES
RUN npm run prisma:generate

RUN npm run prebuild
RUN npm run build

FROM --platform=linux/amd64 node:18-alpine as runner

EXPOSE 3001

# Create app directory
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

RUN npm install -g prisma
RUN npm run prisma:generate

# Install optimized dependencies, running after having all files
RUN npm ci
USER node

ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]