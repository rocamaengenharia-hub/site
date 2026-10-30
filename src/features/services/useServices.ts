import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export interface Service {
    id: string
    title: string
    slug: string
    is_active: boolean
    display_order: number
    created_at: string
    short_description?: string
    description?: string
    seo_title?: string
    seo_description?: string
    images?: string[]
    videos?: string[]
}

export const useServices = () => {
    return useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('display_order', { ascending: true })

            if (error) throw error
            return data as Service[]
        }
    })
}

export const useUploadServiceMedia = () => {
    return useMutation({
        mutationFn: async ({ file, path }: { file: File, path: string }) => {
            const safeFile = new File([file], path.split('/').pop() || 'file', { type: file.type })
            const { data, error } = await supabase.storage
                .from('services')
                .upload(path, safeFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) throw error

            const { data: { publicUrl } } = supabase.storage
                .from('services')
                .getPublicUrl(data.path)

            return publicUrl
        }
    })
}
