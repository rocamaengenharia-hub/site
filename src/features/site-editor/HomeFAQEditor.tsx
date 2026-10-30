import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { usePageContent, useUpdatePageContent } from './useSiteContent'

interface FAQItem {
    question: string
    answer: string
}

interface FAQContent {
    faqs: FAQItem[]
}

const DEFAULTS: FAQContent = {
    faqs: [
        {
            question: 'Quais tipos de obras a Rocama realiza?',
            answer: 'Realizamos obras residenciais de alto padrão, retrofits, construções comerciais e galpões industriais.'
        },
        {
            question: 'Como funciona o acompanhamento técnico?',
            answer: 'Oferecemos acompanhamento técnico integral em todas as etapas com relatórios detalhados de progresso.'
        },
        {
            question: 'A Rocama auxilia no licenciamento?',
            answer: 'Sim. Prestamos consultoria completa para regularização de projetos e obtenção de alvarás.'
        },
        {
            question: 'Qual o prazo médio de entrega?',
            answer: 'O prazo varia conforme a complexidade. Entregamos um cronograma detalhado durante o planejamento.'
        }
    ]
}

export const HomeFAQEditor = () => {
    const { data: pageData, isLoading } = usePageContent('home', 'faq')
    const { mutateAsync: updateContent, isPending: isSaving } = useUpdatePageContent()

    const { register, control, handleSubmit, reset } = useForm<FAQContent>({
        defaultValues: DEFAULTS
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'faqs' })

    useEffect(() => {
        if (pageData?.content?.faqs) {
            reset({ faqs: pageData.content.faqs })
        }
    }, [pageData, reset])

    const onSubmit = async (data: FAQContent) => {
        try {
            await updateContent({
                slug: 'home',
                section: 'faq',
                content: data
            })
            alert('FAQ atualizado!')
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
                    <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
                    <CardDescription>
                        Gerencie as perguntas e respostas exibidas na home.
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
                            <h4 className="font-bold mb-3 text-sm text-muted-foreground uppercase">Pergunta {index + 1}</h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Pergunta</Label>
                                    <Input {...register(`faqs.${index}.question`)} placeholder="Ex: Quais tipos de obras realizam?" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Resposta</Label>
                                    <textarea
                                        {...register(`faqs.${index}.answer`)}
                                        rows={3}
                                        placeholder="Resposta detalhada..."
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ question: '', answer: '' })}
                        className="w-full border-dashed"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Pergunta
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
