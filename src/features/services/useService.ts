import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Service } from './useServices'

export const useService = (idOrSlug: string | undefined) => {
    return useQuery({
        queryKey: ['service', idOrSlug],
        queryFn: async () => {
            if (!idOrSlug) return null

            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)
            const column = isUuid ? 'id' : 'slug'

            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq(column, idOrSlug)
                .single()

            if (error) throw error
            return data as Service
        },
        enabled: !!idOrSlug
    })
}
