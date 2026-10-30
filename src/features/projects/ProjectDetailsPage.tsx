import { useNavigate, useParams } from 'react-router-dom'
import { useProject } from './useProjects'
import { Button } from '../../components/ui/button'
import { ArrowLeft, Edit, ExternalLink, Activity, MapPin, Calendar, Globe } from 'lucide-react'
import { ProjectTimelineEditor } from './components/ProjectTimelineEditor'
import { Badge } from '../../components/ui/badge'

export const ProjectDetailsPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { data: project, isLoading } = useProject(id!)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <Activity className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-muted-foreground">Obra não encontrada.</p>
                <Button variant="outline" onClick={() => navigate('/admin/projects')}>
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
                    <Button variant="ghost" size="icon" onClick={() => navigate('/admin/projects')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight uppercase font-heading">{project.title}</h1>
                            {project.is_featured && (
                                <Badge className="bg-amber-500 hover:bg-amber-600">
                                    Destaque
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground break-all">{project.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <a href={`/projetos/${project.id}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" /> Ver no Site
                        </a>
                    </Button>
                    <Button size="sm" onClick={() => navigate(`/admin/projects/${project.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" /> Editar Informações
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column: Details */}
                <div className="space-y-6 md:col-span-1">
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                        <div className="aspect-video w-full bg-slate-100">
                            {project.main_image ? (
                                <img src={project.main_image} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs uppercase font-bold">Sem imagem principal</div>
                            )}
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <Globe className="h-3 w-3" /> Slug
                                </span>
                                <p className="text-sm font-medium">/{project.slug}</p>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> Localização
                                </span>
                                <p className="text-sm font-medium">{project.location || '-'}</p>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> Data de Conclusão
                                </span>
                                <p className="text-sm font-medium">
                                    {project.completion_date ? new Date(project.completion_date).toLocaleDateString('pt-BR') : '-'}
                                </p>
                            </div>

                            <div className="pt-2 border-t mt-4">
                                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Serviço Vinculado</h4>
                                <p className="text-sm font-bold text-slate-900 bg-slate-50 p-2 rounded border">{project.service?.title || 'Nenhum'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Timeline & Content */}
                <div className="space-y-6 md:col-span-2">
                    {/* Timeline Section */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="p-6">
                            <ProjectTimelineEditor projectId={project.id} />
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="font-semibold leading-none tracking-tight">Descrição do Projeto</h3>
                        </div>
                        <div className="p-6 pt-0">
                            {project.description ? (
                                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {project.description}
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
