import { useNavigate } from 'react-router-dom'
import { ClientForm } from './ClientForm'
import { useCreateClient } from './useCreateClient'

export const CreateClientPage = () => {
    const navigate = useNavigate()
    const { mutateAsync: createClient, isPending } = useCreateClient()

    const handleSubmit = async (data: any) => {
        try {
            await createClient(data)
            navigate('/admin/clients')
        } catch (error) {
            console.error('Erro ao criar cliente:', error)
            alert('Erro ao criar cliente. Tente novamente.')
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Novo Cliente</h2>
                <p className="text-muted-foreground">Preencha os dados do novo cliente.</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
                <ClientForm onSubmit={handleSubmit} isLoading={isPending} />
            </div>
        </div>
    )
}
