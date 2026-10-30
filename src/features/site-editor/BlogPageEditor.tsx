import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Loader2, Save } from 'lucide-react'
import { usePageContent, useUpdatePageContent } from './useSiteContent'

interface BlogHeroContent {
    label: string
    title_line1: string
    title_line2: string
}

const DEFAULTS: BlogHeroContent = {
    label: 'Insights & Conhecimento // LOG_05',
    title_line1: 'BLOG DE',
    title_line2: 'ENGENHARIA.'
}

export const BlogPageEditor = () => {
    const { data: pageData, isLoading } = usePageContent('blog', 'hero')
    const { mutateAsync: updateContent, isPending: isSaving } = useUpdatePageContent()

    const { register, handleSubmit, reset } = useForm<BlogHeroContent>({ defaultValues: DEFAULTS })

    useEffect(() => {
        if (pageData?.content?.label) reset(pageData.content as BlogHeroContent)
    }, [pageData, reset])

    const onSubmit = async (data: BlogHeroContent) => {
        try {
            await updateContent({ slug: 'blog', section: 'hero', content: data })
            alert('Hero do Blog atualizado!')
        } catch { alert('Erro ao salvar.') }
    }

    if (isLoading) return <div>Carregando...</div>

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Hero da Página Blog</CardTitle>
                    <CardDescription>Edite o título e rótulo do banner do blog.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Rótulo Técnico</Label>
                        <Input {...register('label')} />
                    </div>
                    <div className="space-y-2">
                        <Label>Título (Linha 1)</Label>
                        <Input {...register('title_line1')} />
                    </div>
                    <div className="space-y-2">
                        <Label>Título (Linha 2 - Itálico)</Label>
                        <Input {...register('title_line2')} />
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
