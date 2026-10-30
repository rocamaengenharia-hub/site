import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../../components/ui/table"
import { useServices } from "../useServices"
import { Button } from "../../../components/ui/button"
import { Edit, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const ServicesList = () => {
    const navigate = useNavigate()
    const { data: services, isLoading } = useServices()

    if (isLoading) return <div>Carregando serviços...</div>

    if (!services || services.length === 0) {
        return <div className="text-muted-foreground text-center p-4">Nenhum serviço encontrado.</div>
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {services.map((service) => (
                        <TableRow key={service.id}>
                            <TableCell className="font-medium">{service.title}</TableCell>
                            <TableCell className="text-muted-foreground">{service.slug}</TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${service.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800'}`}>
                                    {service.is_active ? 'Ativo' : 'Inativo'}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Ver Detalhes"
                                    onClick={() => navigate(`/admin/services/${service.id}`)}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Editar"
                                    onClick={() => navigate(`/admin/services/${service.id}/edit`)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
