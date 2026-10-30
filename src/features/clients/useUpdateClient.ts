import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Client } from './useClients'

type UpdateClientData = Partial<Omit<Client, 'id' | 'created_at'>>

export const useUpdateClient = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateClientData }) => {
            const { data: updatedClient, error } = await supabase
                .from('clients')
                .update(data)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return updatedClient
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] })
        }
    })
}
