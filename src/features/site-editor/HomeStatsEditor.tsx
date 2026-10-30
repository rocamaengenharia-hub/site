import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { usePageContent, useUpdatePageContent } from './useSiteContent'

interface StatItem {
    value: string
    label: string
    sub: string
}

interface StatsContent {
    stats: StatItem[]
}

const DEFAULTS: StatsContent = {
    stats: [
        { value: '15+', label: 'Anos de Experiência', sub: 'Desde 2008' },
        { value: '120+', label: 'Projetos Entregues', sub: 'Residenciais e Comerciais' },
        { value: '500+', label: 'Clientes Satisfeitos', sub: 'Em todo Brasil' },
        { value: '100%', label: 'Qualidade Garantida', sub: 'Certificação ISO' }
    ]
}

export const HomeStatsEditor = () => {
    const { data: pageData, isLoading } = usePageContent('home', 'stats')
    const { mutateAsync: updateContent, isPending: isSaving } = useUpdatePageContent()

    const { register, control, handleSubmit, reset } = useForm<StatsContent>({
        defaultValues: DEFAULTS
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'stats' })

    useEffect(() => {
        if (pageData?.content?.stats) {
            reset({ stats: pageData.content.stats })
        }
    }, [pageData, reset])

    const onSubmit = async (data: StatsContent) => {
        try {
            await updateContent({
                slug: 'home',
                section: 'stats',
                content: data
            })
            alert('Estatísticas atualizadas!')
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar.')
        }
    }

    if (isLoading) return <div>Carregando...</div>

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Barra de Estatísticas</CardTitle>
                    <CardDescription>
                        Edite os números e rótulos da barra de estatísticas da home.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="relative border p-4 rounded-lg bg-slate-50">
                            <div className="absolute top-2 right-2">
                                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <h4 className="font-bold mb-3 text-sm text-muted-foreground uppercase">Estatística {index + 1}</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Valor</Label>
                                    <Input {...register(`stats.${index}.value`)} placeholder="Ex: 15+" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Rótulo</Label>
                                    <Input {...register(`stats.${index}.label`)} placeholder="Ex: Anos de Experiência" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Subtítulo</Label>
                                    <Input {...register(`stats.${index}.sub`)} placeholder="Ex: Desde 2008" />
                                </div>
                            </div>
                        </div>
                    ))}

                    {fields.length < 4 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ value: '', label: '', sub: '' })}
                            className="w-full border-dashed"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Estatística
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
            </Button>
        </form>
    )
}
