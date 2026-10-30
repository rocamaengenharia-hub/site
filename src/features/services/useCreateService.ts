import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

interface CreateServiceData {
    title: string
    slug: string
    description?: string
    short_description?: string
    seo_title?: string
    seo_description?: string
    is_active?: boolean
    images?: string[]
    videos?: string[]
}

export const useCreateService = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateServiceData) => {
            const { data: newService, error } = await supabase
                .from('services')
                .insert(data)
                .select()
                .single()

            if (error) throw error
            return newService
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] })
        }
    })
}
