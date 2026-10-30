import { useNavigate, useParams } from 'react-router-dom'
import { ClientForm } from './ClientForm'
import { useUpdateClient } from './useUpdateClient'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Client } from './useClients'

export const EditClientPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { mutateAsync: updateClient, isPending: isSaving } = useUpdateClient()

    const { data: client, isLoading: isLoadingClient } = useQuery({
        queryKey: ['client', id],
        queryFn: async () => {
            if (!id) return null
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .eq('id', id)
                .single()
            if (error) throw error
            return data as Client
        },
        enabled: !!id,
    })

    const handleSubmit = async (data: any) => {
        if (!id) return
        try {
            await updateClient({ id, data })
            navigate('/admin/clients')
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error)
            alert('Erro ao atualizar cliente. Tente novamente.')
        }
    }

    if (isLoadingClient) return <div>Carregando...</div>
    if (!client) return <div>Cliente não encontrado</div>

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Editar Cliente</h2>
                <p className="text-muted-foreground">Atualize os dados do cliente.</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
                <ClientForm
                    initialData={{
                        name: client.name,
                        email: client.email || '',
                        phone: client.phone || '',
                        company: client.company || '',
                        notes: client.notes || '',
                        client_type: client.client_type || '',
                        document: client.document || '',
                    }}
                    onSubmit={handleSubmit}
                    isLoading={isSaving}
                />
            </div>
        </div>
    )
}
