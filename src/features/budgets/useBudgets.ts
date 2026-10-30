import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export type BudgetStatus = 'pending' | 'viewed' | 'negotiating' | 'accepted' | 'rejected'

export interface Budget {
    id: string
    client_id: string | null
    service_interest: string | null
    message: string | null
    status: BudgetStatus
    estimated_value: number | null
    attachments?: string[] | null
    created_at: string
    clients?: {
        name: string
        email: string
        phone?: string | null
        company?: string | null
        document?: string | null
    }
}

export const useBudgets = () => {
    return useQuery({
        queryKey: ['budgets'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('budgets')
                .select(`
                    *,
                    clients (
                        name,
                        email,
                        phone,
                        company,
                        document
                    )
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as Budget[]
        }
    })
}
