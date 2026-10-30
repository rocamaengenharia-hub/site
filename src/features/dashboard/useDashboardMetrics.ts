import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export const useDashboardMetrics = () => {
    return useQuery({
        queryKey: ['dashboard-metrics'],
        queryFn: async () => {
            // Parallel requests
            const results = await Promise.all([
                supabase.from('budgets').select('*', { count: 'exact', head: true }),
                supabase.from('clients').select('*', { count: 'exact', head: true }),
                supabase.from('services').select('*', { count: 'exact', head: true }),
                supabase.from('budgets').select('*', { count: 'exact', head: true }).eq('status', 'pending')
            ])

            for (const result of results) {
                if (result.error) throw result.error
            }

            const [
                { count: budgetsCount },
                { count: clientsCount },
                { count: servicesCount },
                { count: pendingBudgetsCount }
            ] = results

            return {
                budgetsCount: budgetsCount || 0,
                clientsCount: clientsCount || 0,
                servicesCount: servicesCount || 0,
                pendingBudgetsCount: pendingBudgetsCount || 0
            }
        }
    })
}
