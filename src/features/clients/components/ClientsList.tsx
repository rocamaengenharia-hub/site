import { Link } from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../components/ui/table'
import { Button } from '../../../components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { useDeleteClient, type Client } from '../useClients'

interface ClientsListProps {
    clients: Client[]
    isLoading: boolean
}

export const ClientsList = ({ clients, isLoading }: ClientsListProps) => {
    const deleteClient = useDeleteClient()

    if (isLoading) {
        return <div>Carregando clientes...</div>
    }

    if (clients.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                Nenhum cliente encontrado.
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client.id}>
                            <TableCell className="font-medium">{client.name}</TableCell>
                            <TableCell>{client.company || '-'}</TableCell>
                            <TableCell>{client.email || '-'}</TableCell>
                            <TableCell>{client.phone || '-'}</TableCell>
                            <TableCell className="flex gap-2">
                                <Link to={`/admin/clients/${client.id}`}>
                                    <Button size="icon" variant="ghost">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-destructive"
                                    onClick={() => {
                                        if (confirm('Tem certeza que deseja excluir este cliente?')) {
                                            deleteClient.mutate(client.id)
                                        }
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div >
    )
}
