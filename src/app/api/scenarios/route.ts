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
  console.log("POST /api/scenarios: Received request");
  try {
    const supabase = await createClient()
    console.log("POST /api/scenarios: Supabase client created");
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error("POST /api/scenarios: Unauthorized attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.log(`POST /api/scenarios: Authenticated user: ${user.id}`);

    const body = await request.json()
    console.log("POST /api/scenarios: Parsed request body:", body);
    const { name, description, data } = body

    if (!name || !data) {
      console.error("POST /api/scenarios: Missing name or data in body");
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
    console.log("POST /api/scenarios: Preparing to insert data:", newScenario);

    const [createdScenario] = await db.insert(scenarios).values(newScenario).returning()
    console.log("POST /api/scenarios: Successfully inserted scenario:", createdScenario);

    return NextResponse.json(createdScenario, { status: 201 })
  } catch (error) {
    console.error("POST /api/scenarios: CATCH BLOCK - An error occurred", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      // @ts-ignore
      errorMessage: error.message,
      // @ts-ignore
      errorStack: error.stack
    }, { status: 500 })
  }
}

