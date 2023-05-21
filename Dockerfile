# Use the latest LTS version of Node.js on Alpine Linux
FROM node:lts-alpine as build

# Set the working directory to /app
WORKDIR /app

# Copy all files to container
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Create a new image with only the build folder and the latest LTS version of Node.js on Alpine Linux
FROM node:lts-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the build folder from the previous image to the container
COPY --from=build /app/build .
COPY --from=build /app/run.sh .

ENTRYPOINT [ "/app/run.sh" ]
