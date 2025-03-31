
# Crime Intelligence Platform Backend

This is the backend service for the Crime Intelligence Platform, providing GraphQL API for the frontend.

## Technologies Used

- GraphQL with Apollo Server
- Prisma ORM for database operations
- PostgreSQL database
- TypeScript

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Set up PostgreSQL database and update the DATABASE_URL in the .env file.

3. Run database migrations:
   ```
   npx prisma migrate dev --name init
   ```

4. Start the development server:
   ```
   npm run dev
   ```

The GraphQL server will be available at http://localhost:4000.

## GraphQL Schema

The schema defines the following main types:
- Person
- Vehicle
- Incident
- Case
- Location
- Evidence
- Product
- Tag
- StatusUpdate

Check `src/schema.graphql` for the complete schema definition.

## API Capabilities

The backend supports the following operations:

### Queries
- Person queries (get, list, search)
- Vehicle queries (get, list, search)
- Incident queries (get, list, recent)
- Case queries (get, list)
- Dashboard statistics
- Graph connections (for network analysis)

### Mutations
- CRUD operations for Person
- CRUD operations for Vehicle
- CRUD operations for Incident
- CRUD operations for Case
- Add status updates to cases
