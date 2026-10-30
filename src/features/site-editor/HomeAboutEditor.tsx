import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { usePageContent, useUpdatePageContent } from './useSiteContent'

interface AboutContent {
    label: string
    title_line1: string
    title_line2: string
    paragraph1: string
    paragraph2: string
    features: { text: string }[]
    image_url: string
    image_location: string
    image_area: string
}

const DEFAULTS: AboutContent = {
    label: 'Sobre Nós / Est. 2010',
    title_line1: 'Solidez técnica e',
    title_line2: 'visão construtiva.',
    paragraph1: 'é sinônimo de excelência na construção civil. Não apenas erguemos estruturas, mas materializamos visões com precisão milimétrica.',
    paragraph2: 'Nossa abordagem integra engenharia de ponta com gestão eficiente, garantindo que cada projeto residencial, comercial ou industrial seja entregue com rigor técnico e acabamento impecável.',
    features: [
        { text: 'Gestão Transparente' },
        { text: 'Equipe Especializada' },
        { text: 'Prazos Garantidos' },
        { text: 'Acabamento Premium' }
    ],
    image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2000&auto=format&fit=crop',
    image_location: 'São Paulo, SP',
    image_area: '1.250 m²'
}

export const HomeAboutEditor = () => {
    const { data: pageData, isLoading } = usePageContent('home', 'about')
    const { mutateAsync: updateContent, isPending: isSaving } = useUpdatePageContent()

    const { register, control, handleSubmit, reset } = useForm<AboutContent>({
        defaultValues: DEFAULTS
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'features' })

    useEffect(() => {
        if (pageData?.content?.title_line1) {
            reset(pageData.content as AboutContent)
        }
    }, [pageData, reset])

    const onSubmit = async (data: AboutContent) => {
        try {
            await updateContent({ slug: 'home', section: 'about', content: data })
            alert('Seção Sobre atualizada!')
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
                    <CardTitle>Seção "Sobre Nós" da Home</CardTitle>
                    <CardDescription>Edite os textos e imagem da seção sobre a empresa na home.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Rótulo</Label>
                        <Input {...register('label')} placeholder="Ex: Sobre Nós / Est. 2010" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Título (Linha 1)</Label>
                            <Input {...register('title_line1')} />
                        </div>
                        <div className="space-y-2">
                            <Label>Título (Linha 2 - Cinza)</Label>
                            <Input {...register('title_line2')} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Parágrafo Principal</Label>
                        <textarea {...register('paragraph1')} rows={3}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="space-y-2">
                        <Label>Parágrafo Secundário</Label>
                        <textarea {...register('paragraph2')} rows={3}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>

                    <div className="space-y-3">
                        <Label>Diferenciais (Checkmarks)</Label>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                                <Input {...register(`features.${index}.text`)} placeholder="Ex: Gestão Transparente" />
                                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ text: '' })}>
                            <Plus className="mr-2 h-4 w-4" /> Adicionar
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label>URL da Imagem</Label>
                        <Input {...register('image_url')} placeholder="URL da imagem" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Localização (foto)</Label>
                            <Input {...register('image_location')} placeholder="Ex: São Paulo, SP" />
                        </div>
                        <div className="space-y-2">
                            <Label>Área (foto)</Label>
                            <Input {...register('image_area')} placeholder="Ex: 1.250 m²" />
                        </div>
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
