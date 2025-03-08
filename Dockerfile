# Use the official Node.js Alpine image as a base
FROM node:18.20.7-alpine3.21 AS base

# Install libc6-compat for compatibility
RUN apk add --no-cache libc6-compat make g++

# Set the working directory
WORKDIR /app

# Install dependencies in a separate stage
FROM base AS deps
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
# Copy node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application code
COPY . .

# Ensure Prisma client is generated before build
RUN npx prisma generate

# Add this to fix the error: "Error: on Environment variable not found"
ENV NEXT_PRIVATE_STANDALONE true

# Build the Next.js application
RUN npm run build

# Prepare the final image
FROM base AS runner
WORKDIR /app
# Create a user and group for running the app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./ 
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000
# Set the environment variable for the port
ENV PORT 3000

# Start the Next.js application
CMD ["node", "server.js"]
