import { useBudgets } from './useBudgets'
import { BudgetsList } from './components/BudgetsList'

export const BudgetsPage = () => {
    const { data: budgets, isLoading } = useBudgets()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Orçamentos</h2>
                <p className="text-muted-foreground">
                    Acompanhe as solicitações de orçamento.
                </p>
            </div>

            <BudgetsList budgets={budgets || []} isLoading={isLoading} />
        </div>
    )
}
