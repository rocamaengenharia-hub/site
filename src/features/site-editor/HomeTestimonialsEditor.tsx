import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { usePageContent, useUpdatePageContent } from './useSiteContent'

interface Testimonial {
    name: string
    role: string
    project: string
    content: string
}

interface TestimonialsContent {
    testimonials: Testimonial[]
}

const DEFAULTS: TestimonialsContent = {
    testimonials: [
        {
            name: 'Ricardo Mendes',
            role: 'Empresário',
            project: 'Galpão Industrial',
            content: 'A precisão técnica e o cumprimento rigoroso dos prazos da Rocama foram fundamentais para a expansão do nosso centro logístico.'
        },
        {
            name: 'Ana Paula Silveira',
            role: 'Arquiteta',
            project: 'Residência Alphaville',
            content: 'Trabalhar com a Rocama é sinônimo de tranquilidade. Eles entendem a visão do arquiteto e entregam uma execução que respeita cada detalhe.'
        },
        {
            name: 'Carlos Ferreira',
            role: 'Investidor Imobiliário',
            project: 'Edifício Horizonte',
            content: 'Encontrei na Rocama um parceiro estratégico. A consultoria técnica deles salvou o projeto de grandes problemas estruturais.'
        }
    ]
}

export const HomeTestimonialsEditor = () => {
    const { data: pageData, isLoading } = usePageContent('home', 'testimonials')
    const { mutateAsync: updateContent, isPending: isSaving } = useUpdatePageContent()

    const { register, control, handleSubmit, reset } = useForm<TestimonialsContent>({
        defaultValues: DEFAULTS
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'testimonials' })

    useEffect(() => {
        if (pageData?.content?.testimonials) {
            reset({ testimonials: pageData.content.testimonials })
        }
    }, [pageData, reset])

    const onSubmit = async (data: TestimonialsContent) => {
        try {
            await updateContent({
                slug: 'home',
                section: 'testimonials',
                content: data
            })
            alert('Depoimentos atualizados!')
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
                    <CardTitle>Depoimentos</CardTitle>
                    <CardDescription>
                        Gerencie os depoimentos de clientes exibidos na home.
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
                            <h4 className="font-bold mb-3 text-sm text-muted-foreground uppercase">Depoimento {index + 1}</h4>
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div className="space-y-2">
                                    <Label>Nome</Label>
                                    <Input {...register(`testimonials.${index}.name`)} placeholder="Ex: João Silva" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cargo / Profissão</Label>
                                    <Input {...register(`testimonials.${index}.role`)} placeholder="Ex: Empresário" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Projeto</Label>
                                    <Input {...register(`testimonials.${index}.project`)} placeholder="Ex: Galpão Industrial" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Depoimento</Label>
                                <textarea
                                    {...register(`testimonials.${index}.content`)}
                                    rows={3}
                                    placeholder="Texto do depoimento..."
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ name: '', role: '', project: '', content: '' })}
                        className="w-full border-dashed"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Depoimento
                    </Button>
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
