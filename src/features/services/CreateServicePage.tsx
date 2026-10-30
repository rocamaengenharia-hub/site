import { ServiceForm } from './ServiceForm'
import { useCreateService } from './useCreateService'
import { useNavigate } from 'react-router-dom'

export const CreateServicePage = () => {
    const { mutateAsync: createService, isPending } = useCreateService()
    const navigate = useNavigate()

    const handleSubmit = async (data: any) => {
        try {
            await createService(data)
            navigate('/admin/services')
        } catch (error) {
            console.error('Failed to create service', error)
            alert('Erro ao criar serviço')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Novo Serviço</h2>
            </div>
            <ServiceForm onSubmit={handleSubmit} isLoading={isPending} />
        </div>
    )
}
