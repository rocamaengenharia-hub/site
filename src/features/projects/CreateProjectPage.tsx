import { ProjectForm } from './components/ProjectForm'
import { useCreateProject } from './useProjects'
import { useNavigate } from 'react-router-dom'

export const CreateProjectPage = () => {
    const { mutateAsync: createProject, isPending } = useCreateProject()
    const navigate = useNavigate()

    const handleSubmit = async (data: any) => {
        try {
            await createProject(data)
            navigate('/admin/projects')
        } catch (error) {
            console.error('Failed to create project', error)
            alert('Erro ao criar obra')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Nova Obra</h2>
            </div>
            <ProjectForm onSubmit={handleSubmit} isLoading={isPending} />
        </div>
    )
}
