import { useParams, useNavigate } from 'react-router-dom'
import { ServiceForm } from './ServiceForm'
import { useService } from './useService'
import { useUpdateService } from './useUpdateService'
import { Activity } from 'lucide-react'

export const EditServicePage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { data: service, isLoading } = useService(id)
    const { mutateAsync: updateService, isPending } = useUpdateService()

    const handleSubmit = async (data: any) => {
        if (!id) return
        try {
            await updateService({ id, ...data })
            navigate('/admin/services')
        } catch (error) {
            console.error('Failed to update service', error)
            alert('Erro ao atualizar serviço')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Activity className="h-6 w-6 animate-spin text-primary" />
            </div>
        )
    }

    if (!service) {
        return <div>Serviço não encontrado</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Editar Serviço</h2>
            </div>

            <ServiceForm
                initialData={{
                    title: service.title,
                    slug: service.slug,
                    is_active: service.is_active,
                    short_description: service.short_description || undefined,
                    description: service.description || undefined,
                    seo_title: service.seo_title || undefined,
                    seo_description: service.seo_description || undefined,
                    images: service.images || [],
                    videos: service.videos || []
                }}
                onSubmit={handleSubmit}
                isLoading={isPending}
            />
        </div>

    )
}
