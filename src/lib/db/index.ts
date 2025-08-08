import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL!

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required")
}

// Create postgres connection
const sql = postgres(databaseUrl)
export const db = drizzle(sql, { schema })
