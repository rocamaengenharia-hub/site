import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export interface Client {
    id: string
    name: string
    email: string | null
    phone: string | null
    company: string | null
    notes: string | null
    client_type?: string
    document?: string
    created_at: string
}

export const useClients = () => {
    return useQuery({
        queryKey: ['clients'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as Client[]
        }
    })
}

export const useDeleteClient = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] })
        }
    })
}
