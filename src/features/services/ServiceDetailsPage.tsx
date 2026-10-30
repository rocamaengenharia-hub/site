import { useNavigate, useParams } from 'react-router-dom'
import { useService } from './useService'
import { Button } from '../../components/ui/button'
import { ArrowLeft, Edit, ExternalLink, Activity, FileText, Globe } from 'lucide-react'
import { Badge } from '../../components/ui/badge'

export const ServiceDetailsPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { data: service, isLoading } = useService(id)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <Activity className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!service) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-muted-foreground">Serviço não encontrado.</p>
                <Button variant="outline" onClick={() => navigate('/admin/services')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/admin/services')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">{service.title}</h1>
                            <Badge variant={service.is_active ? 'default' : 'secondary'} className={service.is_active ? 'bg-green-500 hover:bg-green-600' : ''}>
                                {service.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground break-all">{service.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <a href={`/servicos/${service.slug}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" /> Ver no Site
                        </a>
                    </Button>
                    <Button size="sm" onClick={() => navigate(`/admin/services/${service.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" /> Editar Informações
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column: Details */}
                <div className="space-y-6 md:col-span-1">
                    {/* Basic Info Card */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="font-semibold leading-none tracking-tight">Detalhes do Serviço</h3>
                        </div>
                        <div className="p-6 pt-0 space-y-4">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <Globe className="h-3 w-3" /> Slug
                                </span>
                                <p className="text-sm font-medium">/{service.slug}</p>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <FileText className="h-3 w-3" /> Descrição Curta
                                </span>
                                <p className="text-sm text-muted-foreground">
                                    {service.short_description || 'Nenhuma descrição curta definida.'}
                                </p>
                            </div>

                            <div className="pt-2 border-t mt-4">
                                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">SEO</h4>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground">Título SEO</span>
                                        <p className="text-sm">{service.seo_title || '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground">Descrição SEO</span>
                                        <p className="text-sm line-clamp-2">{service.seo_description || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Full Description */}
                <div className="space-y-6 md:col-span-2">
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="font-semibold leading-none tracking-tight">Descrição Completa</h3>
                        </div>
                        <div className="p-6 pt-0">
                            {service.description ? (
                                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {service.description}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">Sem descrição detalhada.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
