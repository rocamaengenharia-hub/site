import { useNavigate } from 'react-router-dom'
import { useClients } from './useClients'
import { ClientsList } from './components/ClientsList'
import { Button } from '../../components/ui/button'
import { Plus } from 'lucide-react'
export const ClientsPage = () => {
    const { data: clients, isLoading } = useClients()
    const navigate = useNavigate()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
                    <p className="text-muted-foreground">
                        Gerencie a base de clientes da Rocama.
                    </p>
                </div>
                <Button onClick={() => navigate('/admin/clients/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Novo Cliente
                </Button>
            </div>

            <ClientsList clients={clients || []} isLoading={isLoading} />
        </div>
    )
}
