import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Client } from './useClients'

type CreateClientData = Omit<Client, 'id' | 'created_at'>

export const useCreateClient = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateClientData) => {
            const { data: newClient, error } = await supabase
                .from('clients')
                .insert(data)
                .select()
                .single()

            if (error) throw error
            return newClient
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] })
        }
    })
}
