import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Budget } from './useBudgets'

export const useBudget = (id: string | undefined) => {
    return useQuery({
        queryKey: ['budget', id],
        queryFn: async () => {
            if (!id) return null
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
                .eq('id', id)
                .single()

            if (error) throw error
            return data as Budget
        },
        enabled: !!id
    })
}
