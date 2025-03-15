FROM node:20-alpine
WORKDIR /app

# Declare build arguments
ARG STRIPE_SECRET_KEY
ARG NEXT_PUBLIC_STRIPE_PUBLIC_KEY

# Set environment variables for build
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLIC_KEY=$NEXT_PUBLIC_STRIPE_PUBLIC_KEY

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
