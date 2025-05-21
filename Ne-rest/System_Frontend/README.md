# NodeJS Backend Cmd

# Initialize a new Node.js project
npm init -y 

# Install TypeScript and Node.js types as dev dependencies
npm install typescript @types/node --save-dev

# Initialize TypeScript configuration file
npx tsc --init # for initializing typescript and creating tsconfig.json

# Adding Prisma ORM
npm install prisma --save-dev
npx prisma init # for creating prisma folder and initial schema

# Install Prisma client for database access
npm install @prisma/client

# Run Prisma migrations
npx prisma migrate dev --name init
npx prisma migrate deploy
npx prisma db push

# Open Prisma Studio (GUI for your database)
npx prisma studio

# --- Docker Commands ---

# Build the Docker image (name it parking_ms)
docker build -t vanessa121/parking_ms .

# Login to Docker Hub
docker login

# Push the Docker image to your Docker Hub repository
docker push yourusername/parking_ms

# Then run the container, mapping port 4040
docker run -p 4040:4040 vanessa121/parking_ms


# Generating a new swagger 
npm run generate-swagger