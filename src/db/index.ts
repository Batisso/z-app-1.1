import { drizzle } from "drizzle-orm/neon-http";
import { neon } from '@neondatabase/serverless';

// Create a connection pool
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : undefined;

// Check if we have a valid connection before creating the drizzle instance
if (!sql) {
  console.error("DATABASE_URL is not defined");
}

// Create the drizzle instance with error handling
export const db = sql ? drizzle(sql) : undefined;
