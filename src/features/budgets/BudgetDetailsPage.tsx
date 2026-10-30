import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useBudget } from './useBudget'
import { useUpdateBudget } from './useUpdateBudget'
import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { ArrowLeft, Calendar, DollarSign, Mail, Phone, Building, Save } from 'lucide-react'
import type { BudgetStatus } from './useBudgets'

const statusOptions: { value: BudgetStatus; label: string }[] = [
    { value: 'pending', label: 'Pendente' },
    { value: 'viewed', label: 'Visualizado' },
    { value: 'negotiating', label: 'Em Negociação' },
    { value: 'accepted', label: 'Aprovado' },
    { value: 'rejected', label: 'Rejeitado' },
]

export const BudgetDetailsPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: budget, isLoading } = useBudget(id)
    const { mutate: updateBudget, isPending: isUpdating } = useUpdateBudget()
    const [editValue, setEditValue] = useState<string>('')

    useEffect(() => {
        if (budget?.estimated_value) {
            setEditValue(budget.estimated_value.toString())
        }
    }, [budget])

    if (isLoading) return <div>Carregando...</div>
    if (!budget) return <div>Orçamento não encontrado</div>

    const client = budget.clients

    const handleSaveValue = () => {
        if (id) {
            const val = parseFloat(editValue)
            updateBudget({ id, estimated_value: isNaN(val) ? 0 : val })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/budgets')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Detalhes do Orçamento</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Solicitação</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-1 text-primary tracking-widest text-[10px] uppercase font-mono">Serviço de Interesse</h4>
                                <p className="text-xl font-heading font-bold uppercase">{budget.service_interest || 'Não especificado'}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1 text-primary tracking-widest text-[10px] uppercase font-mono">Mensagem / Escopo</h4>
                                <p className="whitespace-pre-wrap text-slate-600 bg-slate-50 p-6 border-l-4 border-slate-200">
                                    {budget.message || 'Sem mensagem'}
                                </p>
                            </div>

                            {budget.attachments && Array.isArray(budget.attachments) && budget.attachments.length > 0 && (
                                <div className="pt-6 border-t">
                                    <h4 className="font-semibold mb-4 text-primary tracking-widest text-[10px] uppercase font-mono">Anexos Técnicos</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {budget.attachments.map((url: string, i: number) => (
                                            <a
                                                key={i}
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-3 p-4 bg-white border hover:border-primary transition-all group"
                                            >
                                                <div className="w-10 h-10 bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">DOC</div>
                                                <span className="text-xs font-mono truncate flex-grow">Anexo_0{i + 1}.pdf</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Identificação Técnica</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Responsável</span>
                                    <div className="text-lg font-bold uppercase">{client?.name || '-'}</div>
                                </div>
                                <div className="space-y-2">
                                    <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Documento</span>
                                    <div className="text-lg font-bold uppercase">{client?.document || '-'}</div>
                                </div>
                                <div className="space-y-2">
                                    <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Canal de Contato</span>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-3 w-3 text-primary" />
                                            <span>{client?.email || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-3 w-3 text-primary" />
                                            <span>{client?.phone || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Empresa / Tipo</span>
                                    <div className="flex items-center gap-2 font-bold uppercase">
                                        <Building className="h-4 w-4 text-slate-300" />
                                        <span>{client?.company || 'Pessoa Física'}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-slate-950 text-white border-0">
                        <CardHeader>
                            <CardTitle className="text-primary tracking-widest text-[10px] uppercase font-mono">Gestão do Orçamento</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div>
                                <h4 className="text-sm font-medium mb-4 text-slate-400">Fluxo de Status</h4>
                                <div className="flex flex-col gap-2">
                                    {statusOptions.map((option) => {
                                        const isSelected = budget.status === option.value
                                        const getStatusColor = (status: string) => {
                                            switch (status) {
                                                case 'pending': return 'bg-yellow-500 border-yellow-500 text-slate-900'
                                                case 'viewed': return 'bg-blue-500 border-blue-500 text-white'
                                                case 'negotiating': return 'bg-purple-500 border-purple-500 text-white'
                                                case 'accepted': return 'bg-green-500 border-green-500 text-slate-900'
                                                case 'rejected': return 'bg-red-500 border-red-500 text-white'
                                                default: return ''
                                            }
                                        }

                                        return (
                                            <Button
                                                key={option.value}
                                                variant="outline"
                                                className={`justify-start w-full font-bold uppercase text-[10px] tracking-widest rounded-none border-white/10 ${isSelected ? getStatusColor(option.value) : 'bg-transparent hover:bg-white/5 text-white hover:text-white'}`}
                                                onClick={() => {
                                                    if (!isSelected && id) {
                                                        updateBudget({ id, status: option.value })
                                                    }
                                                }}
                                                disabled={isUpdating}
                                            >
                                                {option.label}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10">
                                <h4 className="text-sm font-medium mb-4 text-slate-400 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-primary" /> Valor Estimado (R$)
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            placeholder="00.00"
                                            className="bg-white/5 border-white/10 text-white font-heading font-bold text-xl rounded-none h-14"
                                            type="number"
                                        />
                                        <Button
                                            onClick={handleSaveValue}
                                            disabled={isUpdating}
                                            className="h-14 w-14 bg-primary text-slate-950 hover:bg-white rounded-none shrink-0"
                                        >
                                            <Save className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-500 uppercase">
                                        Atual: {budget.estimated_value
                                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(budget.estimated_value)
                                            : 'PENDENTE_DEFINIÇÃO'}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10">
                                <h4 className="text-sm font-medium mb-2 text-slate-400 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" /> Data Original
                                </h4>
                                <p className="font-mono text-[10px] text-slate-300">{new Date(budget.created_at).toLocaleString('pt-BR')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
