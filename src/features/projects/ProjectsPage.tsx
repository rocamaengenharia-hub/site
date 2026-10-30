import { Button } from '../../components/ui/button'
import { Plus } from 'lucide-react'
import { ProjectsList } from './components/ProjectsList'
import { useNavigate } from 'react-router-dom'

export const ProjectsPage = () => {
    const navigate = useNavigate()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Obras Realizadas</h2>
                <Button onClick={() => navigate('/admin/projects/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Nova Obra
                </Button>
            </div>

            <ProjectsList />
        </div>
    )
}
