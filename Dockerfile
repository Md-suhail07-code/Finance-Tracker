# Stage 1 : Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY ./Frontend/package*.json ./
RUN npm install
COPY ./Frontend .
RUN npm run build

# Stage 2: Run Backend
FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl

COPY ./Backend/package*.json ./
RUN npm install

COPY ./Backend .

COPY --from=frontend-build /app/dist ./public

RUN npx prisma generate

EXPOSE 5000
CMD ["node", "server.js"]