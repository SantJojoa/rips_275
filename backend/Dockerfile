# ---------- STAGE 1: build ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Si usas TypeScript:
# RUN npm run build

# ---------- STAGE 2: production ----------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev


COPY --from=builder /app .

EXPOSE 3000

CMD ["npm", "start"]
