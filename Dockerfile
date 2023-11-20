# This Dockerfile/Containerfile is based on the official Next.js sample:
# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM node:18 AS base

# Install dependencies only when needed
FROM base AS deps

WORKDIR /app

COPY package*.json ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "A package-lock.json was not found. Run 'npm i --package-lock-only' to generate it." && exit 1; \
  fi

# Rebuild the source code and schemas only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# These can be overwritten using "docker run -e", or in a deployment.yaml
# when being run on kubernetes
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
