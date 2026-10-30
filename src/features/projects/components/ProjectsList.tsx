import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../../components/ui/table"
import { useProjects } from "../useProjects"
import { Button } from "../../../components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDeleteProject } from "../useProjects"

export const ProjectsList = () => {
    const navigate = useNavigate()
    const { data: projects, isLoading } = useProjects()
    const { mutateAsync: deleteProject } = useDeleteProject()

    if (isLoading) return <div>Carregando obras...</div>

    if (!projects || projects.length === 0) {
        return <div className="text-muted-foreground text-center p-4">Nenhuma obra encontrada.</div>
    }

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta obra?')) {
            await deleteProject(id)
        }
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Serviço Vinculado</TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map((project) => (
                        <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell className="text-muted-foreground">{project.service?.title || '-'}</TableCell>
                            <TableCell className="text-muted-foreground">{project.location || '-'}</TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Ver Detalhes e Linha do Tempo"
                                    onClick={() => navigate(`/admin/projects/${project.id}`)}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Editar Informações"
                                    onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Excluir"
                                    onClick={() => handleDelete(project.id)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
