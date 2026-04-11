FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Generate prisma client
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npx prisma generate
ENV NODE_TLS_REJECT_UNAUTHORIZED=1

# Build application
RUN npm run build

FROM node:20-alpine

WORKDIR /app

# Copy built assets and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

CMD [ "npm", "run", "start:prod" ]
