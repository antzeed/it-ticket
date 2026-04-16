FROM node:20-alpine AS builder

WORKDIR /app
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Install dependencies
COPY package*.json ./
RUN npm config set strict-ssl false && npm install

# Copy source
COPY . .

# Build application
RUN npm run build

FROM node:20-alpine

WORKDIR /app
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Copy built assets and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
