import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Loader2, Save } from 'lucide-react'
import { usePageContent, useUpdatePageContent } from './useSiteContent'

interface CTAContent {
    title_line1: string
    title_line2: string
    description: string
    whatsapp_number: string
    button_primary_text: string
    button_secondary_text: string
}

const DEFAULTS: CTAContent = {
    title_line1: 'VAMOS ESPECIFICAR SEU',
    title_line2: 'PRÓXIMO PROJETO?',
    description: 'Da fundação ao acabamento, entregamos precisão técnica e gestão inteligente para obras de qualquer complexidade.',
    whatsapp_number: '5500000000000',
    button_primary_text: 'Solicitar Consultoria Técnica',
    button_secondary_text: 'Falar no WhatsApp'
}

export const HomeCTAEditor = () => {
    const { data: pageData, isLoading } = usePageContent('home', 'cta')
    const { mutateAsync: updateContent, isPending: isSaving } = useUpdatePageContent()

    const { register, handleSubmit, reset } = useForm<CTAContent>({
        defaultValues: DEFAULTS
    })

    useEffect(() => {
        if (pageData?.content?.title_line1) {
            reset(pageData.content as CTAContent)
        }
    }, [pageData, reset])

    const onSubmit = async (data: CTAContent) => {
        try {
            await updateContent({ slug: 'home', section: 'cta', content: data })
            alert('CTA atualizado!')
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
                    <CardTitle>Chamada Final (CTA)</CardTitle>
                    <CardDescription>Edite o texto e link do WhatsApp da seção final da home.</CardDescription>
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
                        <textarea {...register('description')} rows={2}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="space-y-2">
                        <Label>Número do WhatsApp (com DDI, sem +)</Label>
                        <Input {...register('whatsapp_number')} placeholder="Ex: 5531999999999" />
                        <p className="text-[10px] text-muted-foreground">Formato: 55 + DDD + número. Ex: 5531999999999</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Texto Botão Principal</Label>
                            <Input {...register('button_primary_text')} />
                        </div>
                        <div className="space-y-2">
                            <Label>Texto Botão WhatsApp</Label>
                            <Input {...register('button_secondary_text')} />
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
