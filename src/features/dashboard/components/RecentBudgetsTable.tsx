import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../../components/ui/table"
import { useRecentBudgets } from "../useRecentBudgets"

export const RecentBudgetsTable = () => {
    const { data: budgets, isLoading } = useRecentBudgets()

    if (isLoading) return <div>Carregando...</div>

    if (!budgets || budgets.length === 0) {
        return <div className="text-sm text-muted-foreground">Nenhum orçamento recente.</div>
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        }
    }

    const translateStatus = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendente'
            case 'viewed': return 'Visualizado'
            case 'negotiating': return 'Em Negociação'
            case 'accepted': return 'Aceito'
            case 'rejected': return 'Recusado'
            default: return status
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Data</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {budgets.map((budget) => (
                    <TableRow key={budget.id}>
                        <TableCell className="font-medium">
                            <div>{budget.client?.name || 'Cliente Desconhecido'}</div>
                            <div className="text-xs text-muted-foreground">{budget.client?.email}</div>
                        </TableCell>
                        <TableCell>{budget.service_interest}</TableCell>
                        <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(budget.status)}`}>
                                {translateStatus(budget.status)}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">
                            {new Date(budget.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
