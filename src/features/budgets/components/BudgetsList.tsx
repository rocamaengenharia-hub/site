import { Link } from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../components/ui/table'
import { Button } from '../../../components/ui/button'
import { Eye } from 'lucide-react'
import type { Budget, BudgetStatus } from '../useBudgets'
import { cn } from '../../../lib/utils'

interface BudgetsListProps {
    budgets: Budget[]
    isLoading: boolean
}

const statusMap: Record<BudgetStatus, { label: string; color: string }> = {
    pending: { label: 'Pendente', color: 'bg-yellow-500/10 text-yellow-500' },
    viewed: { label: 'Visualizado', color: 'bg-blue-500/10 text-blue-500' },
    negotiating: { label: 'Em Negociação', color: 'bg-purple-500/10 text-purple-500' },
    accepted: { label: 'Aprovado', color: 'bg-green-500/10 text-green-500' },
    rejected: { label: 'Rejeitado', color: 'bg-red-500/10 text-red-500' },
}

export const BudgetsList = ({ budgets, isLoading }: BudgetsListProps) => {
    if (isLoading) {
        return <div>Carregando orçamentos...</div>
    }

    if (budgets.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                Nenhum orçamento encontrado.
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Serviço de Interesse</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor Est.</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {budgets.map((budget) => (
                        <TableRow key={budget.id}>
                            <TableCell className="font-medium">
                                {budget.clients?.name || 'Cliente Removido'}
                                <div className="text-xs text-muted-foreground">
                                    {budget.clients?.email}
                                </div>
                            </TableCell>
                            <TableCell>{budget.service_interest || '-'}</TableCell>
                            <TableCell>
                                {new Date(budget.created_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                                {budget.estimated_value
                                    ? new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    }).format(budget.estimated_value)
                                    : '-'}
                            </TableCell>
                            <TableCell>
                                <span
                                    className={cn(
                                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                        statusMap[budget.status].color
                                    )}
                                >
                                    {statusMap[budget.status].label}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Link to={`/admin/budgets/${budget.id}`}>
                                    <Button size="icon" variant="ghost">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
