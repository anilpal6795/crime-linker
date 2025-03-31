
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolvers } from './resolvers';
import path from 'path';

const prisma = new PrismaClient();

// Read the schema file
const typeDefs = readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    context: async () => ({ prisma }),
    listen: { port: 4000 }
  });
  
  console.log(`🚀 Server ready at ${url}`);
}

// Connect to Prisma, then start server
prisma.$connect()
  .then(() => {
    console.log('Connected to database');
    return startServer();
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });

// Handle shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
