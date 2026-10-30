import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export interface OrganizationSettings {
    id: string
    company_name: string
    logo_url?: string
    contact_email?: string
    whatsapp?: string
    instagram_url?: string
    facebook_url?: string
    linkedin_url?: string
    address?: string
    navbar_bg_color?: string
    navbar_text_color?: string
}

export const useSettings = () => {
    return useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('organization_settings')
                .select('*')
                .limit(1)
                .maybeSingle()

            if (error) throw error

            // Return default structure if no settings exist yet
            if (!data) {
                return {
                    company_name: 'Rocama Engenharia',
                } as OrganizationSettings
            }

            return data as OrganizationSettings
        }
    })
}

export const useUpdateSettings = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (settings: Partial<OrganizationSettings>) => {
            // Check if a row exists
            const { data: existing } = await supabase
                .from('organization_settings')
                .select('id')
                .limit(1)
                .maybeSingle()

            if (existing) {
                const { data, error } = await supabase
                    .from('organization_settings')
                    .update({ ...settings, updated_at: new Date().toISOString() })
                    .eq('id', existing.id)
                    .select()
                    .single()

                if (error) throw error
                return data
            } else {
                const { data, error } = await supabase
                    .from('organization_settings')
                    .insert([settings])
                    .select()
                    .single()

                if (error) throw error
                return data
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] })
        }
    })
}
