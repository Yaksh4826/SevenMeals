"use client"

import { useEffect, useState, useContext, createContext } from "react"
import { supabase } from "@/app/lib/supabaseClient"

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        
        if (!supabase) {
            console.error("Supabase client not initialized")
            return
        }

        const initializeAuth = async () => {
            try {
                const { data } = await supabase.auth.getUser()
                setUser(data.user)
            } catch (error) {
                console.error("Failed to get user:", error)
            }
        }

        initializeAuth()

        // listen for changes
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user || null)
            }
        )

        return () => listener.subscription.unsubscribe()
    }, [])

    const login = async (email, password) => {
        await supabase.auth.signInWithPassword({ email, password })
    }

    const logout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, mounted }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}