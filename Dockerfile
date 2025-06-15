#? Based from https://www.tomray.dev/nestjs-docker-production

#* ------------- BUILD ARGUMENTS ------------------------ #
# See https://docs.docker.com/build/building/variables/#arg-usage-example

# Node.js version to use for the base image.
# Do NOT use a V prefix, just the version number, as defined in https://hub.docker.com/_/node/
ARG NODEJS_VERSION
# Project refers to NestJS Monorepo projects, which are defined in nest-cli.json.
# See https://docs.nestjs.com/cli/monorepo
ARG PROJECT

#* ------------- BASE ------------------- #
# Create a base stage with common configurations
FROM node:${NODEJS_VERSION}-alpine AS base

# Install pnpm and configure environment
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PATH=/usr/src/node_modules/.bin:$PATH
ENV PNPM_HOME=/usr/src/.pnpm

# Set working directory
WORKDIR /usr/src/app

# Use the node user for security
USER node

#* ------------- DEPENDENCIES ------------------- #
FROM base AS dependencies

# Copy only package files first to leverage cache
COPY --chown=node:node package.json pnpm-lock.yaml ./

# Install dependencies with specific flags for production
RUN pnpm install --frozen-lockfile --prod

# Install dev dependencies in a separate layer
RUN pnpm install --frozen-lockfile

#* ------------- BUILDER ------------------- #
FROM base AS builder

ARG PROJECT

# Copy dependencies from previous stage
COPY --chown=node:node --from=dependencies /usr/src/app/node_modules ./node_modules

# Copy source with specific focus on necessary files
COPY --chown=node:node tsconfig*.json nest-cli.json ./
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node apps ./apps
COPY --chown=node:node libs ./libs

# Generate Prisma Client and build
RUN pnpm prisma generate && \
    pnpm run build ${PROJECT}

#* ------------- PRODUCTION ------------------- #
FROM node:${NODEJS_VERSION}-alpine AS production

ARG PROJECT
ENV NODE_ENV=production
ENV NEST_PROJECT=${PROJECT}

WORKDIR /app

# Install curl for healthcheck but remove cache in same layer
RUN apk --no-cache add curl

# Copy only production dependencies
COPY --chown=node:node --from=dependencies /usr/src/app/node_modules ./node_modules
# Copy built application
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
# Copy Prisma files (only what's needed)
COPY --chown=node:node --from=builder /usr/src/app/prisma/schema.prisma ./prisma/
COPY --chown=node:node --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

USER node

CMD ["sh", "-c", "node dist/apps/${NEST_PROJECT}/main.js"]
