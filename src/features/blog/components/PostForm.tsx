import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { Loader2, Search, Info } from 'lucide-react'
import { sanitizeFileName } from '../../../lib/utils'
import { useNavigate } from 'react-router-dom'
import { FileUpload } from '../../../components/ui/file-upload'
import { useUploadPostMedia } from '../usePosts'
import { Switch } from '../../../components/ui/switch'
import { useServices } from '../../services/useServices'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"

const postSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9-]+$/, 'Slug inválido (apenas letras minúsculas e hífen)'),
    excerpt: z.string().optional(),
    content: z.string().min(1, 'Conteúdo é obrigatório'),
    main_image: z.string().optional(),
    author_name: z.string().min(1, 'Autor é obrigatório'),
    category_id: z.string().optional(),
    is_published: z.boolean(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
})

type PostFormData = z.infer<typeof postSchema>

interface PostFormProps {
    initialData?: Partial<PostFormData>
    onSubmit: (data: PostFormData) => Promise<void>
    isLoading?: boolean
}

export const PostForm = ({ initialData, onSubmit, isLoading }: PostFormProps) => {
    const navigate = useNavigate()
    const { mutateAsync: uploadMedia } = useUploadPostMedia()
    const { data: services } = useServices()
    const [uploading, setUploading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PostFormData>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            author_name: 'Rocama Engenharia',
            is_published: false,
            seo_title: '',
            seo_description: '',
            ...initialData
        }
    })

    const mainImage = watch('main_image')
    const postTitle = watch('title')
    const seoTitle = watch('seo_title')

    const handleFormSubmit = async (data: PostFormData) => {
        await onSubmit(data)
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 max-w-5xl mx-auto pb-20">
            <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="content" className="flex items-center gap-2">
                        <Info className="h-4 w-4" /> Conteúdo Principal
                    </TabsTrigger>
                    <TabsTrigger value="seo" className="flex items-center gap-2">
                        <Search className="h-4 w-4" /> SEO & Metadados
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Conteúdo do Artigo</CardTitle>
                            <CardDescription>Escreva o artigo principal aqui.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border">
                                <Switch
                                    id="is_published"
                                    checked={watch('is_published')}
                                    onCheckedChange={(checked) => setValue('is_published', checked)}
                                />
                                <Label htmlFor="is_published" className="cursor-pointer">Publicar artigo (Visível no site)</Label>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Título do Artigo</Label>
                                    <Input id="title" placeholder="Ex: Tendências da Engenharia em 2026" {...register('title')} />
                                    {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL SEO)</Label>
                                    <Input id="slug" placeholder="ex: tendencias-engenharia-2026" {...register('slug')} />
                                    {errors.slug && <p className="text-destructive text-xs">{errors.slug.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="author_name">Autor</Label>
                                    <Input id="author_name" {...register('author_name')} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category_id">Categoria</Label>
                                    <select
                                        id="category_id"
                                        {...register('category_id')}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    >
                                        <option value="">-- Sem Categoria --</option>
                                        {services?.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Resumo (Excerpt)</Label>
                                <Textarea id="excerpt" placeholder="Breve introdução que aparece na lista..." {...register('excerpt')} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Conteúdo Principal (HTML permitido)</Label>
                                <Textarea id="content" placeholder="Escreva seu artigo aqui..." className="min-h-[400px] font-mono text-sm" {...register('content')} />
                                {errors.content && <p className="text-destructive text-xs">{errors.content.message}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Imagem de Capa</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FileUpload
                                accept={{ 'image/*': [] }}
                                maxFiles={1}
                                value={mainImage ? [mainImage] : []}
                                onChange={async (files) => {
                                    const file = files[0]
                                    if (!file) return
                                    setUploading(true)
                                    try {
                                        const path = `cover-${Date.now()}-${sanitizeFileName(file.name)}`
                                        const url = await uploadMedia({ file, path })
                                        setValue('main_image', url, { shouldDirty: true })
                                    } catch (e) {
                                        alert("Erro ao enviar imagem")
                                    } finally {
                                        setUploading(false)
                                    }
                                }}
                                onRemove={() => setValue('main_image', '', { shouldDirty: true })}
                                label="Upload da imagem de capa"
                                disabled={uploading}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="seo" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações de SEO</CardTitle>
                            <CardDescription>Otimize como este artigo aparece nos motores de busca (Google).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="seo_title">SEO Title (Título no Google)</Label>
                                <Input id="seo_title" placeholder="Título otimizado para busca" {...register('seo_title')} />
                                <p className="text-[10px] text-muted-foreground uppercase font-mono">
                                    Preview: {seoTitle || postTitle || 'Título da página'} | Rocama Engenharia
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="seo_description">Meta Description (Resumo no Google)</Label>
                                <Textarea id="seo_description" placeholder="Resumo atraente para os resultados de busca (Máx 160 caracteres)" {...register('seo_description')} />
                            </div>

                            <div className="bg-slate-50 border rounded-lg p-6 space-y-2 overflow-hidden">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Google Search Preview</h4>
                                <div className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer truncate">
                                    {seoTitle || postTitle || 'Título Exemplo do Artigo'}
                                </div>
                                <div className="text-[#006621] text-sm truncate">
                                    rocama.com.br/blog/{watch('slug') || 'slug-do-artigo'}
                                </div>
                                <div className="text-[#4d5156] text-sm line-clamp-2">
                                    {watch('seo_description') || 'Aqui aparecerá o resumo do seu artigo quando alguém pesquisar no Google. Escreva algo que chame a atenção para aumentar os cliques.'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 sticky bottom-4 bg-background/95 backdrop-blur p-4 border rounded-xl shadow-lg z-10">
                <Button type="button" variant="ghost" onClick={() => navigate('/admin/blog')}>Cancelar</Button>
                <Button type="submit" disabled={isLoading || uploading}>
                    {(isLoading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Artigo
                </Button>
            </div>
        </form>
    )
}
