import { useParams, useNavigate } from 'react-router-dom'
import { ProjectForm } from './components/ProjectForm'
import { useProject, useUpdateProject } from './useProjects'
import { Loader2 } from 'lucide-react'

export const EditProjectPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { data: project, isLoading } = useProject(id!)
    const { mutateAsync: updateProject, isPending } = useUpdateProject()

    const handleSubmit = async (data: any) => {
        if (!id) return
        try {
            await updateProject({ id, ...data })
            navigate('/admin/projects')
        } catch (error) {
            console.error('Failed to update project', error)
            alert('Erro ao atualizar obra')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        )
    }

    if (!project) {
        return <div>Obra não encontrada</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Editar Obra</h2>
            </div>

            <ProjectForm
                initialData={{
                    title: project.title,
                    slug: project.slug,
                    description: project.description || '',
                    location: project.location || '',
                    service_id: project.service_id || '',
                    is_featured: project.is_featured,
                    main_image: project.main_image || '',
                    gallery: project.gallery || [],
                    gallery_project: project.gallery_project || [],
                    gallery_process: project.gallery_process || [],
                    show_gallery_project: project.show_gallery_project || false,
                    show_gallery_process: project.show_gallery_process || false,
                }}
                onSubmit={handleSubmit}
                isLoading={isPending}
            />
        </div>
    )
}
