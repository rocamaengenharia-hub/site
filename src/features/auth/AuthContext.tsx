import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

type AuthContextType = {
    session: Session | null
    user: User | null
    loading: boolean
    isAdmin: boolean | null
}

const AuthContext = createContext<AuthContextType>({ session: null, user: null, loading: true, isAdmin: null })

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        }).catch((err) => {
            console.error('Failed to get session:', err)
            setLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        if (!user?.id) {
            setIsAdmin(null)
            return
        }
        let cancelled = false
        void Promise.resolve(
            supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle()
        ).then(
            ({ data }) => {
                if (!cancelled) setIsAdmin(!!data)
            },
            () => {
                if (!cancelled) setIsAdmin(false)
            }
        )
        return () => {
            cancelled = true
        }
    }, [user?.id])

    const value = {
        session,
        user,
        loading,
        isAdmin,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
