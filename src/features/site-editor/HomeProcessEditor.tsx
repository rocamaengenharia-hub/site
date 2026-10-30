import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { usePageContent, useUpdatePageContent } from './useSiteContent'

interface ProcessStep {
    title: string
    description: string
}

interface ProcessContent {
    steps: ProcessStep[]
}

const DEFAULTS: ProcessContent = {
    steps: [
        { title: 'BRIEFING & CONCEPÇÃO', description: 'Entendemos sua necessidade e transformamos ideias em conceitos tangíveis. Alinhamento de expectativas e viabilidade financeira.' },
        { title: 'PLANEJAMENTO TÉCNICO', description: 'Desenvolvimento de projetos executivos, cronogramas e aprovações legais. Detalhamento completo da engenharia.' },
        { title: 'EXECUÇÃO DA OBRA', description: 'Gestão rigorosa de qualidade, prazos e materiais. Monitoramento em tempo real com relatórios de evolução.' },
        { title: 'ENTREGA E AUDITORIA', description: 'Vistoria técnica final, limpeza pós-obra e entrega das chaves. Excelência atestada pelos nossos engenheiros.' }
    ]
}

export const HomeProcessEditor = () => {
    const { data: pageData, isLoading } = usePageContent('home', 'process')
    const { mutateAsync: updateContent, isPending: isSaving } = useUpdatePageContent()

    const { register, control, handleSubmit, reset } = useForm<ProcessContent>({
        defaultValues: DEFAULTS
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'steps' })

    useEffect(() => {
        if (pageData?.content?.steps) {
            reset({ steps: pageData.content.steps })
        }
    }, [pageData, reset])

    const onSubmit = async (data: ProcessContent) => {
        try {
            await updateContent({ slug: 'home', section: 'process', content: data })
            alert('Processo Executivo atualizado!')
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
                    <CardTitle>Processo Executivo</CardTitle>
                    <CardDescription>Edite as etapas do processo exibidas na home.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="relative border p-4 rounded-lg bg-slate-50">
                            <div className="absolute top-2 right-2">
                                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <h4 className="font-bold mb-3 text-sm text-muted-foreground uppercase">Etapa {index + 1}</h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Título</Label>
                                    <Input {...register(`steps.${index}.title`)} placeholder="Ex: BRIEFING & CONCEPÇÃO" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Descrição</Label>
                                    <textarea {...register(`steps.${index}.description`)} rows={2}
                                        placeholder="Descrição da etapa..."
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                                </div>
                            </div>
                        </div>
                    ))}
                    {fields.length < 6 && (
                        <Button type="button" variant="outline" onClick={() => append({ title: '', description: '' })} className="w-full border-dashed">
                            <Plus className="mr-2 h-4 w-4" /> Adicionar Etapa
                        </Button>
                    )}
                </CardContent>
            </Card>
            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" /> Salvar Alterações
            </Button>
        </form>
    )
}
