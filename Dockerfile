FROM node:8.9.4-alpine AS builder
COPY . /app/
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install
ENV FAKEBOX_API=http://localhost:8080
EXPOSE 3000
CMD ["npm", "start"]