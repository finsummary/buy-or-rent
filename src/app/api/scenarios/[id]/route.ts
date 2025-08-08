import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { scenarios } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

// DELETE /api/scenarios/[id] - удалить сценарий
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: scenarioId } = await params

    // Проверяем, принадлежит ли сценарий пользователю и удаляем
    const deletedScenarios = await db
      .delete(scenarios)
      .where(
        and(
          eq(scenarios.id, scenarioId),
          eq(scenarios.userId, user.id)
        )
      )
      .returning()

    if (deletedScenarios.length === 0) {
      return NextResponse.json(
        { error: "Scenario not found or not authorized" }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting scenario:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// GET /api/scenarios/[id] - получить конкретный сценарий
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: scenarioId } = await params

    const scenario = await db
      .select()
      .from(scenarios)
      .where(
        and(
          eq(scenarios.id, scenarioId),
          eq(scenarios.userId, user.id)
        )
      )
      .limit(1)

    if (scenario.length === 0) {
      return NextResponse.json(
        { error: "Scenario not found" }, 
        { status: 404 }
      )
    }

    return NextResponse.json(scenario[0])
  } catch (error) {
    console.error("Error fetching scenario:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

