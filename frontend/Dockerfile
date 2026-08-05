FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy aplikasi
COPY . .

# Expose port
EXPOSE 5173

# Run dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
