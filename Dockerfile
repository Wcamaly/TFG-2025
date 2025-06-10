#? Based from https://www.tomray.dev/nestjs-docker-production

#* ------------- BUILD ARGUMENTS ------------------------ #
# See https://docs.docker.com/build/building/variables/#arg-usage-example

# Node.js version to use for the base image.
# Do NOT use a V prefix, just the version number, as defined in https://hub.docker.com/_/node/
ARG NODEJS_VERSION
# Project refers to NestJS Monorepo projects, which are defined in nest-cli.json.
# See https://docs.nestjs.com/cli/monorepo
ARG PROJECT

#* ------------- DEPENDENCY-INSTALLER ------------------- #
# Define the base image for the dependency-installer stage
# This stage sets up the environment with Node.js for installing dependencies.
# It installs necessary tools and dependencies required for the application.
# Using a separate dependency-installer stage helps keep the final image lean and optimized.

FROM node:${NODEJS_VERSION}-alpine AS dependency-installer
# Set working directory
WORKDIR /usr/src/app

# Set PATH to include node_modules binaries for running tools directly
ENV PATH=/usr/src/node_modules/.bin:$PATH

# Copy application dependency manifests to the container image.
# Copying this first prevents re-running npm install on every code change.
# We use --chmod=555 to make sure no write permissions are assigned to the copied resource.
COPY --chown=node:node --chmod=555 package.json ./
COPY --chown=node:node --chmod=555 package-lock.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
# with verbose logging for better debugging
RUN npm ci --loglevel verbose

# Copy the entire application source code for building
# Note: It is recommended to be more specific to avoid copying unnecessary files
#? For that purpose, a .dockerignore was created
# We use --chmod=555 to make sure no write permissions are assigned to the copied resource.
COPY --chown=node:node --chmod=555  . .

#HACK: This is a hack for being able to execute development stage.
# Without this, it complains with an error of lack of permissions
# RUN chown -R node:node /usr/src/app

# Use the node user from the image (instead of the root user)
USER node

#* -------------------------------------- #

#* ------------- DEVELOPMENT ------------------- #
# Create a development stage
# This stage sets up environment for development purposes.
# It inherits from the dependency-installer stage and runs the application in development mode.
# This allows for easier debugging and testing during development.

FROM dependency-installer AS development

ARG PROJECT

ENV NEST_PROJECT=${PROJECT}

# Set the default command to run the application in development mode
CMD ["sh", "-c", "npm run start:docker ${NEST_PROJECT}"]
#* -------------------------------------- #

#* ------------- BUILD PRODUCTION ------------------- #

FROM node:${NODEJS_VERSION}-alpine AS build-production

# Project refers to NestJS Monorepo projects, which are defined in nest-cli.json.
# See https://docs.nestjs.com/cli/monorepo
ARG PROJECT

WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# Copying this first prevents re-running npm install on every code change.
# We use --chmod=555 to make sure no write permissions are assigned to the copied resource.
COPY --chown=node:node --chmod=555 package.json ./
COPY --chown=node:node --chmod=555 package-lock.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency.
# In the previous dependency-installer stage we ran `npm ci` which installed all dependencies,
# so we can copy over the node_modules directory from the dependency-installer image
# We use --chmod=555 to make sure no write permissions are assigned to the copied resource.
COPY --chown=node:node --from=dependency-installer --chmod=555 /usr/src/app/node_modules ./node_modules

# We use --chmod=555 to make sure no write permissions are assigned to the copied resource.
COPY --chown=node:node --chmod=555 . .

# Run the build command which creates the production bundle
RUN npm run build ${PROJECT}

#* ------------- PRODUCTION ------------------- #
# Define the final stage for the production image
# This stage sets up the final runtime environment for deploying the application.
# The built application files are copied from the prod-builder stage to the Nginx server directory.

FROM node:${NODEJS_VERSION}-alpine AS production

# Project refers to NestJS Monorepo projects, which are defined in nest-cli.json.
# See https://docs.nestjs.com/cli/monorepo
ARG PROJECT
ENV NEST_PROJECT=${PROJECT}

WORKDIR /app

# Copy the bundled code from the build stage to the production image
# We use --chmod=555 to make sure no write permissions are assigned to the copied resource.
COPY --chown=node:node --from=build-production --chmod=555 /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build-production --chmod=555 /usr/src/app/dist/ ./dist

# Install curl to make the healthcheck
RUN apk --no-cache add curl

# Set NODE_ENV environment variable
ENV NODE_ENV=production

# Start the server using the production build
# We cant do
# CMD [ "node", "dist/apps/${PROJECT}/main.js" ]
# Because of how CMD interprets variables like ${PROJECT}
# instead, we use the shell form of CMD

CMD ["sh", "-c", "node dist/apps/${NEST_PROJECT}/main.js"]
