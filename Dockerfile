FROM node:8.9.4-alpine AS builder
RUN mkdir -p /app

WORKDIR /app

ARG machine_box_key
RUN docker run -p 8080:8080 -e "MB_KEY=$machine_box_key" machinebox/fakebox
ENV PATH /app/node_modules/.bin:$PATH
ENV FAKEBOX_API=http://localhost:8080