import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { usePageContent, useUpdatePageContent } from './useSiteContent'

// --- HERO ---
interface AboutHeroContent {
    label: string
    title_line1: string
    title_line2: string
    founded_year: string
    specialty: string
    location: string
}

const HERO_DEFAULTS: AboutHeroContent = {
    label: 'Memorial Descritivo // REF.001',
    title_line1: 'QUEM SOMOS',
    title_line2: 'NÓS.',
    founded_year: '2010',
    specialty: 'Engenharia Pesada',
    location: 'Brasil / MG & SP'
}

// --- STORY ---
interface Milestone { year: string; text: string }
interface AboutStoryContent {
    title_line1: string
    title_line2: string
    paragraph1: string
    paragraph2: string
    quote: string
    milestones: Milestone[]
}

const STORY_DEFAULTS: AboutStoryContent = {
    title_line1: 'UMA TRAJETÓRIA DE',
    title_line2: 'ENGENHARIA PURA.',
    paragraph1: 'Fundada em 2010, a Rocama Engenharia nasceu com um propósito claro: elevar o padrão construtivo através de rigor técnico impecável e transparência absoluta. O que começou como um escritório especializado em consultoria estrutural, rapidamente evoluiu para uma construtora de ciclo completo.',
    paragraph2: 'Ao longo de mais de uma década, consolidamos nossa presença nos mercados de Minas Gerais e São Paulo, executando desde residências de altíssimo luxo até complexos industriais de alta complexidade.',
    quote: 'Para nós, engenharia não é sobre erguer paredes, é sobre gerenciar a complexidade com simplicidade e maestria.',
    milestones: [
        { year: '2010', text: 'Fundação em Nova Lima / MG' },
        { year: '2015', text: 'Expansão para Obras Industriais' },
        { year: '2021', text: 'Sede Principal em São Paulo' }
    ]
}

// --- PHILOSOPHY ---
interface PhilosophyValue { title: string; description: string }
interface PhilosophyContent {
    values: PhilosophyValue[]
}

const PHILOSOPHY_DEFAULTS: PhilosophyContent = {
    values: [
        { title: 'INTEGRIDADE ESTRUTURAL', description: 'Nossa conduta ética é a fundação de cada projeto. Transparência absoluta em orçamentos, materiais e processos executivos.' },
        { title: 'PRECISÃO TÉCNICA', description: 'Engenharia de detalhe. Minimizar margens de erro através de planejamento rigoroso e tecnologia de ponta em todas as fases.' },
        { title: 'COMPROMISSO DE ENTREGA', description: 'Cronogramas não são sugestões, são contratos. Garantimos pontualidade através de uma gestão de obra disciplinada.' }
    ]
}

export const AboutPageEditor = () => {
    const { data: heroData, isLoading: heroLoading } = usePageContent('about', 'hero')
    const { data: storyData, isLoading: storyLoading } = usePageContent('about', 'story')
    const { data: philData, isLoading: philLoading } = usePageContent('about', 'philosophy')
    const { mutateAsync: updateContent, isPending: isSaving } = useUpdatePageContent()

    // Hero form
    const heroForm = useForm<AboutHeroContent>({ defaultValues: HERO_DEFAULTS })
    useEffect(() => {
        if (heroData?.content?.title_line1) heroForm.reset(heroData.content as AboutHeroContent)
    }, [heroData, heroForm])

    // Story form
    const storyForm = useForm<AboutStoryContent>({ defaultValues: STORY_DEFAULTS })
    const milestoneFields = useFieldArray({ control: storyForm.control, name: 'milestones' })
    useEffect(() => {
        if (storyData?.content?.title_line1) storyForm.reset(storyData.content as AboutStoryContent)
    }, [storyData, storyForm])

    // Philosophy form
    const philForm = useForm<PhilosophyContent>({ defaultValues: PHILOSOPHY_DEFAULTS })
    const valuesFields = useFieldArray({ control: philForm.control, name: 'values' })
    useEffect(() => {
        if (philData?.content?.values) philForm.reset({ values: philData.content.values })
    }, [philData, philForm])

    const saveHero = async (data: AboutHeroContent) => {
        try {
            await updateContent({ slug: 'about', section: 'hero', content: data })
            alert('Hero da página Sobre atualizado!')
        } catch { alert('Erro ao salvar.') }
    }

    const saveStory = async (data: AboutStoryContent) => {
        try {
            await updateContent({ slug: 'about', section: 'story', content: data })
            alert('História atualizada!')
        } catch { alert('Erro ao salvar.') }
    }

    const savePhilosophy = async (data: PhilosophyContent) => {
        try {
            await updateContent({ slug: 'about', section: 'philosophy', content: data })
            alert('Filosofia Técnica atualizada!')
        } catch { alert('Erro ao salvar.') }
    }

    if (heroLoading || storyLoading || philLoading) return <div>Carregando...</div>

    return (
        <div className="space-y-8">
            {/* HERO */}
            <form onSubmit={heroForm.handleSubmit(saveHero)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Hero da Página Sobre</CardTitle>
                        <CardDescription>Título, rótulo e informações de destaque.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Rótulo Técnico</Label>
                            <Input {...heroForm.register('label')} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Título (Linha 1)</Label>
                                <Input {...heroForm.register('title_line1')} />
                            </div>
                            <div className="space-y-2">
                                <Label>Título (Linha 2)</Label>
                                <Input {...heroForm.register('title_line2')} />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Ano de Fundação</Label>
                                <Input {...heroForm.register('founded_year')} />
                            </div>
                            <div className="space-y-2">
                                <Label>Especialidade</Label>
                                <Input {...heroForm.register('specialty')} />
                            </div>
                            <div className="space-y-2">
                                <Label>Localização</Label>
                                <Input {...heroForm.register('location')} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Salvar Hero
                </Button>
            </form>

            {/* STORY */}
            <form onSubmit={storyForm.handleSubmit(saveStory)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Nossa História</CardTitle>
                        <CardDescription>Textos, citação e marcos históricos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Título (Linha 1)</Label>
                                <Input {...storyForm.register('title_line1')} />
                            </div>
                            <div className="space-y-2">
                                <Label>Título (Linha 2)</Label>
                                <Input {...storyForm.register('title_line2')} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Parágrafo 1</Label>
                            <textarea {...storyForm.register('paragraph1')} rows={4}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                        </div>
                        <div className="space-y-2">
                            <Label>Parágrafo 2</Label>
                            <textarea {...storyForm.register('paragraph2')} rows={4}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                        </div>
                        <div className="space-y-2">
                            <Label>Citação em Destaque</Label>
                            <textarea {...storyForm.register('quote')} rows={2}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                        </div>
                        <div className="space-y-3">
                            <Label>Marcos Históricos</Label>
                            {milestoneFields.fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <Input {...storyForm.register(`milestones.${index}.year`)} placeholder="Ano" className="w-24" />
                                    <Input {...storyForm.register(`milestones.${index}.text`)} placeholder="Descrição" />
                                    <Button type="button" variant="destructive" size="sm" onClick={() => milestoneFields.remove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => milestoneFields.append({ year: '', text: '' })}>
                                <Plus className="mr-2 h-4 w-4" /> Adicionar Marco
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Salvar História
                </Button>
            </form>

            {/* PHILOSOPHY */}
            <form onSubmit={philForm.handleSubmit(savePhilosophy)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Filosofia Técnica</CardTitle>
                        <CardDescription>Os pilares de valor da empresa.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {valuesFields.fields.map((field, index) => (
                            <div key={field.id} className="relative border p-4 rounded-lg bg-slate-50">
                                <div className="absolute top-2 right-2">
                                    <Button type="button" variant="destructive" size="sm" onClick={() => valuesFields.remove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <h4 className="font-bold mb-3 text-sm text-muted-foreground uppercase">Pilar {index + 1}</h4>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Título</Label>
                                        <Input {...philForm.register(`values.${index}.title`)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Descrição</Label>
                                        <textarea {...philForm.register(`values.${index}.description`)} rows={2}
                                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => valuesFields.append({ title: '', description: '' })} className="w-full border-dashed">
                            <Plus className="mr-2 h-4 w-4" /> Adicionar Pilar
                        </Button>
                    </CardContent>
                </Card>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Salvar Filosofia
                </Button>
            </form>
        </div>
    )
}
