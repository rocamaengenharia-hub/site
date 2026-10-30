import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

interface UpdateServiceData {
    id: string
    title?: string
    slug?: string
    description?: string
    short_description?: string
    seo_title?: string
    seo_description?: string
    is_active?: boolean
    images?: string[]
    videos?: string[]
}

export const useUpdateService = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: UpdateServiceData) => {
            const { id, ...updates } = data
            const { data: updatedService, error } = await supabase
                .from('services')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return updatedService
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] })
            queryClient.invalidateQueries({ queryKey: ['service'] })
        }
    })
}
