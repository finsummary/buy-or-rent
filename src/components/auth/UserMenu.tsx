"use client";

import { signOut } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, LogOut, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface UserMenuProps {
  onSaveScenario?: () => void
}

export function UserMenu({ onSaveScenario }: UserMenuProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (!user) {
    return (
      <Button 
        onClick={() => window.location.href = '/auth/signin'}
        variant="outline"
        size="sm"
      >
        <User className="mr-2 h-4 w-4" />
        Sign In
      </Button>
    )
  }

  return (
    <Card className="backdrop-blur-sm bg-white/90 border-white/60 shadow-lg">
      <CardContent className="p-3">
        <div className="flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-3">
            {user.user_metadata?.avatar_url && (
              <img 
                src={user.user_metadata.avatar_url} 
                alt={user.user_metadata?.full_name || 'User'} 
                className="h-8 w-8 rounded-full"
              />
            )}
            <div>
              <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onSaveScenario && (
              <Button
                onClick={onSaveScenario}
                size="sm"
                variant="outline"
              >
                <Save className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              onClick={handleSignOut}
              size="sm"
              variant="ghost"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

