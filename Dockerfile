# 1️⃣ Use official Node.js LTS image
FROM node:20-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install --production

# 5️⃣ Copy the rest of the project
COPY . .

# 6️⃣ Build Next.js app
RUN npm run build

# 7️⃣ Expose the port
EXPOSE 8000

# 8️⃣ Start the app
CMD ["npm", "start"]

