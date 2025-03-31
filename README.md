
# Crime Intelligence Platform

A comprehensive platform for tracking incidents, cases, and persons of interest for crime intelligence.

## Project Structure

This is a monorepo containing both frontend and backend packages:

- `/src`: Frontend React application
- `/src/backend`: Backend GraphQL API with Prisma and PostgreSQL

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd src/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a PostgreSQL database and update the DATABASE_URL in the `.env` file.

4. Run database migrations:
   ```
   npx prisma migrate dev --name init
   ```

5. Seed the database (optional):
   ```
   npm run seed
   ```

6. Start the backend server:
   ```
   npm run dev
   ```

The GraphQL API will be available at http://localhost:4000.

### Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the frontend development server:
   ```
   npm run dev
   ```

The frontend app will be available at http://localhost:5173.

## Features

- Incident reporting and management
- Case management
- Person of interest tracking
- Vehicle tracking
- Evidence management
- Connection analysis with graph visualization
- Geographic analysis with map visualization
- Dashboard with statistics and recent activities

## Technology Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- shadcn/ui component library
- Recharts for data visualization

### Backend
- Node.js with TypeScript
- Apollo Server for GraphQL API
- Prisma ORM
- PostgreSQL database
