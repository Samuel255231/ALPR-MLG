"use client"

import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import imgLogin from "../assets/loginImg.png"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { login } from "@/redux/slices/AuthSlice"
import { useNavigate } from "react-router-dom"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, userToken } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // Redirection si déjà connecté
  useEffect(() => {
    const storedToken = localStorage.getItem('userTokenAlpr');
    console.log('LoginForm.useEffect storedToken:', storedToken, 'redux userToken:', userToken)
    if (storedToken || userToken) {
      navigate('/')
    }
  }, [navigate, userToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) return
    await dispatch(login({ username, password }))
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenue</h1>
                <p className="text-muted-foreground text-balance">
                  Connectez-vous à votre compte
                </p>
              </div>

              {/* Username */}
              <div className="grid gap-3">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="ex: test"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Erreur */}
              {error && (
                <p className="text-sm text-red-500 text-center">
                  {error}
                </p>
              )}

              {/* Bouton */}
              <Button
                type="submit"
                className="w-full bg-blue-500"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </div>
          </form>

          {/* Image côté droit */}
          <div
            className="relative inline-block hidden md:block rounded-full bg-gradient-to-r from-sky-400 via-indigo-600 to-indigo-900 p-[8px]"
            data-aos="zoom-in"
            data-aos-delay={200}
          >
            <img
              src={imgLogin}
              alt="Login illustration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
