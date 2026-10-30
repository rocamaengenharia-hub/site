import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Loader2 } from 'lucide-react'

const clientSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    phone: z.string().optional(),
    company: z.string().optional(),
    notes: z.string().optional(),
    client_type: z.string().optional(),
    document: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientFormProps {
    initialData?: ClientFormData
    onSubmit: (data: ClientFormData) => Promise<void>
    isLoading: boolean
}

export const ClientForm = ({ initialData, onSubmit, isLoading }: ClientFormProps) => {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: initialData || {
            name: '',
            email: '',
            phone: '',
            company: '',
            notes: '',
            client_type: '',
            document: '',
        },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
            <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" {...register('phone')} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" {...register('company')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="client_type">Tipo de Cliente</Label>
                    <select
                        id="client_type"
                        {...register('client_type')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">Selecione...</option>
                        <option value="PF">Pessoa Física</option>
                        <option value="PJ">Pessoa Jurídica</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="document">CPF/CNPJ</Label>
                    <Input id="document" placeholder="000.000.000-00" {...register('document')} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Input id="notes" {...register('notes')} />
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/clients')}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Cliente
                </Button>
            </div>
        </form>
    )
}
