import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export interface Budget {
    id: string
    client: { name: string; email: string } | null
    service_interest: string
    status: 'pending' | 'viewed' | 'negotiating' | 'accepted' | 'rejected'
    created_at: string
}

export const useRecentBudgets = () => {
    return useQuery({
        queryKey: ['recent-budgets'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('budgets')
                .select(`
          id,
          service_interest,
          status,
          created_at,
          client:client_id (
            name,
            email
          )
        `)
                .order('created_at', { ascending: false })
                .limit(5)

            if (error) throw error

            // Transform data to match interface if needed, or rely on TS inference but explicit is better
            return data as unknown as Budget[]
        }
    })
}
