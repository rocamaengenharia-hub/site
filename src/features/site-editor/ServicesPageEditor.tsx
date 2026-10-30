import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Loader2, Save } from 'lucide-react'
import { usePageContent, useUpdatePageContent } from './useSiteContent'

interface ServicesHeroContent {
    label: string
    title_line1: string
    title_line2: string
}

const DEFAULTS: ServicesHeroContent = {
    label: 'Index de Especialidades // MOD_03',
    title_line1: 'NOSSOS SERVIÇOS',
    title_line2: 'ESPECIFICADOS.'
}

export const ServicesPageEditor = () => {
    const { data: pageData, isLoading } = usePageContent('services', 'hero')
    const { mutateAsync: updateContent, isPending: isSaving } = useUpdatePageContent()

    const { register, handleSubmit, reset } = useForm<ServicesHeroContent>({
        defaultValues: DEFAULTS
    })

    useEffect(() => {
        if (pageData?.content?.label) {
            reset(pageData.content as ServicesHeroContent)
        }
    }, [pageData, reset])

    const onSubmit = async (data: ServicesHeroContent) => {
        try {
            await updateContent({
                slug: 'services',
                section: 'hero',
                content: data
            })
            alert('Hero da página de Serviços atualizado!')
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
                    <CardTitle>Hero da Página de Serviços</CardTitle>
                    <CardDescription>
                        Edite o título e rótulo do banner principal da página de serviços.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Rótulo Técnico</Label>
                        <Input {...register('label')} placeholder="Ex: Index de Especialidades // MOD_03" />
                    </div>
                    <div className="space-y-2">
                        <Label>Título (Linha 1)</Label>
                        <Input {...register('title_line1')} placeholder="Ex: NOSSOS SERVIÇOS" />
                    </div>
                    <div className="space-y-2">
                        <Label>Título (Linha 2 - Itálico)</Label>
                        <Input {...register('title_line2')} placeholder="Ex: ESPECIFICADOS." />
                    </div>
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
