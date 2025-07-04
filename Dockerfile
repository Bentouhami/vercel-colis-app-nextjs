FROM node:20-alpine3.19
WORKDIR /app

# Update Alpine packages to reduce vulnerabilities
RUN apk update && apk upgrade --no-cache

# Declare build arguments
ARG NEXT_PUBLIC_STRIPE_PUBLIC_KEY

# Set environment variables for build
ENV NEXT_PUBLIC_STRIPE_PUBLIC_KEY=$NEXT_PUBLIC_STRIPE_PUBLIC_KEY

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
