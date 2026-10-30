import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Loader2, Lock } from 'lucide-react'

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

type LoginData = z.infer<typeof loginSchema>

export const Login = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const location = useLocation()
    const stateMessage = (location.state as { message?: string } | null)?.message

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginData) => {
        if (loading) return
        setLoading(true)
        setError(null)
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })

        if (error) {
            const msg = error.message === 'Invalid login credentials'
                ? 'Credenciais inválidas. Tente novamente.'
                : error.message
            setError(msg)
            setLoading(false)
        } else {
            navigate('/admin')
        }
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-foreground">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight">
                        Rocama Engenharia
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Acesso administrativo restrito
                    </p>
                </div>

                {(error || stateMessage) && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive text-center">
                        {error ?? stateMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@rocama.com"
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="text-xs text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            'Entrar'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}
