"use client";

import { signInWithOAuth } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Chrome, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

export function SignIn() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setLoading(true);
    try {
      await signInWithOAuth(provider);
    } catch (error) {
      console.error('OAuth sign in error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/90 border-white/60 shadow-xl">
          <CardContent className="flex items-center justify-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/90 border-white/60 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to BuyOrRent.io</CardTitle>
          <CardDescription>
            Sign in to save and manage your buy vs rent scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 text-center">{message}</p>
            </div>
          )}
          
          <Button
            onClick={() => handleOAuthSignIn("google")}
            className="w-full"
            variant="outline"
            size="lg"
            disabled={loading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
          
          <Button
            onClick={() => handleOAuthSignIn("github")}
            className="w-full"
            variant="outline"
            size="lg"
            disabled={loading}
          >
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue as guest
              </span>
            </div>
          </div>
          
          <Button
            onClick={() => window.location.href = "/"}
            className="w-full"
            variant="ghost"
            disabled={loading}
          >
            Continue without account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
