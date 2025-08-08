import { pgTable, text, timestamp, uuid, jsonb, primaryKey } from "drizzle-orm/pg-core"

// Supabase handles auth.users automatically, we just reference it
// Our application tables
export const scenarios = pgTable("scenarios", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(), // References auth.users(id) in Supabase
  name: text("name").notNull(),
  description: text("description"),
  data: jsonb("data").notNull(), // Store CalculatorInputs as JSON
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

// Types for our application
export type Scenario = typeof scenarios.$inferSelect
export type NewScenario = typeof scenarios.$inferInsert

// Supabase User type (from auth.users)
export interface User {
  id: string
  email?: string
  name?: string
  image?: string
  created_at?: string
  updated_at?: string
}

