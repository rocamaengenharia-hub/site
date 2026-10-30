import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { usePageContent, useUpdatePageContent } from './useSiteContent'

interface ContactContent {
    title_line1: string
    title_line2: string
    description: string
    background_image: string
    interest_options: { value: string; label: string }[]
}

const DEFAULTS: ContactContent = {
    title_line1: 'Estamos Prontos',
    title_line2: 'Para Atendê-lo',
    description: 'Entre em contato conosco para solicitar um orçamento, tirar dúvidas ou agendar uma visita técnica. Nossa equipe retornará o mais breve possível.',
    background_image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2670&auto=format&fit=crop',
    interest_options: [
        { value: 'nr12', label: 'Adequação NR12' },
        { value: 'laudos', label: 'Laudos e Inspeções' },
        { value: 'treinamento', label: 'Treinamentos' },
        { value: 'outro', label: 'Outros Assuntos' }
    ]
}

export const ContactPageEditor = () => {
    const { data: pageData, isLoading } = usePageContent('contact', 'main')
    const { mutateAsync: updateContent, isPending: isSaving } = useUpdatePageContent()

    const { register, control, handleSubmit, reset } = useForm<ContactContent>({ defaultValues: DEFAULTS })
    const { fields, append, remove } = useFieldArray({ control, name: 'interest_options' })

    useEffect(() => {
        if (pageData?.content?.title_line1) reset(pageData.content as ContactContent)
    }, [pageData, reset])

    const onSubmit = async (data: ContactContent) => {
        try {
            await updateContent({ slug: 'contact', section: 'main', content: data })
            alert('Página de Contato atualizada!')
        } catch { alert('Erro ao salvar.') }
    }

    if (isLoading) return <div>Carregando...</div>

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Página de Contato</CardTitle>
                    <CardDescription>Edite os textos, imagem de fundo e opções de interesse do formulário.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Título (Linha 1)</Label>
                            <Input {...register('title_line1')} />
                        </div>
                        <div className="space-y-2">
                            <Label>Título (Linha 2 - Destaque)</Label>
                            <Input {...register('title_line2')} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Descrição</Label>
                        <textarea {...register('description')} rows={3}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="space-y-2">
                        <Label>URL da Imagem de Fundo</Label>
                        <Input {...register('background_image')} placeholder="URL da imagem" />
                    </div>
                    <div className="space-y-3">
                        <Label>Opções de Interesse (Dropdown do formulário)</Label>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                                <Input {...register(`interest_options.${index}.value`)} placeholder="Valor (ex: nr12)" className="w-32" />
                                <Input {...register(`interest_options.${index}.label`)} placeholder="Rótulo (ex: Adequação NR12)" />
                                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '', label: '' })}>
                            <Plus className="mr-2 h-4 w-4" /> Adicionar Opção
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" /> Salvar Alterações
            </Button>
        </form>
    )
}
