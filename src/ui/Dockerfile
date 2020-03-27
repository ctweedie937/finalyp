FROM node:8.9.4-alpine AS builder
RUN mkdir -p /app
COPY . /app
WORKDIR /app
RUN npm install
ENV FAKEBOX_API=http://localhost:8080
EXPOSE 3000
CMD ["npm", "start"]