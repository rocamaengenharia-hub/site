import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { BudgetStatus } from './useBudgets'

export const useUpdateBudget = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...updates }: { id: string; status?: BudgetStatus; estimated_value?: number }) => {
            const { error } = await supabase
                .from('budgets')
                .update(updates)
                .eq('id', id)

            if (error) throw error
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] })
            queryClient.invalidateQueries({ queryKey: ['budget', id] })
        }
    })
}

// Keep the old name for compatibility if needed, but point to the new one
export const useUpdateBudgetStatus = useUpdateBudget
