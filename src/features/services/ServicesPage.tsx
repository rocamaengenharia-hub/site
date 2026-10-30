import { Button } from '../../components/ui/button'
import { Plus } from 'lucide-react'
import { ServicesList } from './components/ServicesList'
import { useNavigate } from 'react-router-dom'

export const ServicesPage = () => {
    const navigate = useNavigate()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Serviços</h2>
                <Button onClick={() => navigate('/admin/services/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Novo Serviço
                </Button>
            </div>

            <ServicesList />
        </div>
    )
}
