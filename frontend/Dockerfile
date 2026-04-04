
FROM node:18 AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build Vite app
RUN npm run build



FROM node:18

WORKDIR /app

# Install static server
RUN npm install -g serve

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 5173

# Run the app
CMD ["serve", "-s", "dist", "-l", "5173"]