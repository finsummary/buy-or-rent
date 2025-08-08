import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { scenarios } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

// GET /api/scenarios - получить все сценарии пользователя
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userScenarios = await db
      .select()
      .from(scenarios)
      .where(eq(scenarios.userId, user.id))
      .orderBy(desc(scenarios.updatedAt))

    return NextResponse.json(userScenarios)
  } catch (error) {
    console.error("Error fetching scenarios:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST /api/scenarios - создать новый сценарий
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, data } = body

    if (!name || !data) {
      return NextResponse.json(
        { error: "Name and data are required" }, 
        { status: 400 }
      )
    }

    const newScenario = {
      userId: user.id,
      name,
      description: description || null,
      data,
    }

    const [createdScenario] = await db.insert(scenarios).values(newScenario).returning()

    return NextResponse.json(createdScenario, { status: 201 })
  } catch (error) {
    console.error("Error creating scenario:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

