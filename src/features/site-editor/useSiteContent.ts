import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export interface PageContent {
    id: string
    slug: string
    section: string
    content: Record<string, any>
}

export const usePageContent = (slug: string, section: string = 'main') => {
    return useQuery({
        queryKey: ['site-content', slug, section],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('site_pages')
                .select('*')
                .eq('slug', slug)
                .eq('section', section)
                .maybeSingle()

            if (error) throw error

            if (!data) {
                // Return default empty structure if not found
                return {
                    slug,
                    section,
                    content: {}
                } as PageContent
            }

            return data as PageContent
        }
    })
}

export const useUpdatePageContent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ slug, section = 'main', content }: { slug: string, section?: string, content: any }) => {
            const { data: existing } = await supabase
                .from('site_pages')
                .select('id')
                .eq('slug', slug)
                .eq('section', section)
                .maybeSingle()

            if (existing) {
                const { data, error } = await supabase
                    .from('site_pages')
                    .update({
                        content,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existing.id)
                    .select()
                    .single()

                if (error) throw error
                return data
            } else {
                const { data, error } = await supabase
                    .from('site_pages')
                    .insert([{
                        slug,
                        section,
                        content
                    }])
                    .select()
                    .single()

                if (error) throw error
                return data
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['site-content', variables.slug, variables.section] })
        }
    })
}
