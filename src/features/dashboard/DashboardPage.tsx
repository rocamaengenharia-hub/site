import { useDashboardMetrics } from './useDashboardMetrics'
import { FileText, Users, Wrench, Clock, Activity } from 'lucide-react'
import { RecentBudgetsTable } from './components/RecentBudgetsTable'

export const DashboardPage = () => {
    const { data: metrics, isLoading } = useDashboardMetrics()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <Activity className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8 h-full">
            <div>
                <h1 className="text-2xl font-medium text-[#121212]">Olá, Admin!</h1>
                <p className="text-muted-foreground">Bem-vindo de volta ao painel da Rocama.</p>
            </div>

            {/* Top Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel: Operational Metrics */}
                <div className="bg-[#fafafa] border border-[#ededed] rounded-[16px] p-6 flex flex-col justify-center h-[200px]">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                <Clock className="h-4 w-4" />
                                <span>Pendentes</span>
                            </div>
                            <div className="text-3xl font-bold text-[#121212]">{metrics?.pendingBudgetsCount}</div>
                            <p className="text-xs text-muted-foreground">Aguardando resposta</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                <Users className="h-4 w-4" />
                                <span>Clientes</span>
                            </div>
                            <div className="text-3xl font-bold text-[#121212]">{metrics?.clientsCount}</div>
                            <p className="text-xs text-muted-foreground">Cadastrados</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel: System Metrics */}
                <div className="bg-[#fafafa] border border-[#ededed] rounded-[16px] p-6 flex flex-col justify-center h-[200px]">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                <Wrench className="h-4 w-4" />
                                <span>Serviços</span>
                            </div>
                            <div className="text-3xl font-bold text-[#121212]">{metrics?.servicesCount}</div>
                            <p className="text-xs text-muted-foreground">Ativos no site</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                <FileText className="h-4 w-4" />
                                <span>Total</span>
                            </div>
                            <div className="text-3xl font-bold text-[#121212]">{metrics?.budgetsCount}</div>
                            <p className="text-xs text-muted-foreground">Solicitações</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Recent Budgets */}
            <div className="bg-[#fafafa] border border-[#ededed] rounded-[16px] p-6 min-h-[400px]">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-lg text-[#121212]">Orçamentos Recentes</h3>
                        <p className="text-sm text-muted-foreground">Últimas solicitações recebidas.</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-[#ededed] overflow-hidden">
                    <RecentBudgetsTable />
                </div>
            </div>
        </div>
    )
}
