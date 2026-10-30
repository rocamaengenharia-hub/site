import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Loader2 } from 'lucide-react'
import { sanitizeFileName } from '../../lib/utils'
import { useNavigate } from 'react-router-dom'
import { FileUpload } from '../../components/ui/file-upload'
import { useUploadServiceMedia } from './useServices'
import { Switch } from '../../components/ui/switch'

const serviceSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9-]+$/, 'Slug inválido (apenas letras minúsculas e hífen)'),
    short_description: z.string().optional(),
    description: z.string().optional(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    is_active: z.boolean(),
    images: z.array(z.string()).optional(),
    videos: z.array(z.string()).optional(),
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface ServiceFormProps {
    initialData?: ServiceFormData
    onSubmit: (data: ServiceFormData) => Promise<void>
    isLoading?: boolean
}

export const ServiceForm = ({ initialData, onSubmit, isLoading }: ServiceFormProps) => {
    const navigate = useNavigate()
    const { mutateAsync: uploadMedia } = useUploadServiceMedia()
    const [uploading, setUploading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            is_active: true,
            title: '',
            slug: '',
            short_description: '',
            description: '',
            seo_title: '',
            seo_description: '',
            images: [],
            videos: [],
            ...initialData
        }
    })

    const images = watch('images') || []
    const videos = watch('videos') || []

    const handleFormSubmit = async (data: ServiceFormData) => {
        // Just ensure arrays are present if they were undefined
        const finalData: ServiceFormData = {
            ...data,
            images: data.images || [],
            videos: data.videos || []
        }
        await onSubmit(finalData)
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 max-w-5xl mx-auto">
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informações Básicas</CardTitle>
                        <CardDescription>
                            Defina os detalhes principais do serviço.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center space-x-2 col-span-2 mb-4 bg-muted/50 p-3 rounded-lg border">
                            <Switch
                                id="is_active"
                                checked={watch('is_active')}
                                onCheckedChange={(checked) => setValue('is_active', checked)}
                            />
                            <Label htmlFor="is_active" className="cursor-pointer">
                                Serviço Ativo (Visível no site)
                            </Label>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Título do Serviço</Label>
                            <Input id="title" placeholder="Ex: Construção Civil" {...register('title')} />
                            {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input id="slug" placeholder="ex: construcao-civil" {...register('slug')} />
                            {errors.slug && <p className="text-destructive text-xs">{errors.slug.message}</p>}
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="short_description">Descrição Curta</Label>
                            <Input id="short_description" placeholder="Resumo para listagens" {...register('short_description')} />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="description">Descrição Completa</Label>
                            <Textarea
                                id="description"
                                placeholder="Detalhes completos do serviço..."
                                className="min-h-[150px]"
                                {...register('description')}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Mídia do Serviço</CardTitle>
                        <CardDescription>
                            Adicione imagens e vídeos para apresentar este serviço.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Galeria de Imagens</Label>
                            <FileUpload
                                accept={{ 'image/*': [] }}
                                maxFiles={8}
                                value={images}
                                onChange={async (files) => {
                                    if (files.length === 0) return
                                    setUploading(true)
                                    try {
                                        const urls: string[] = []
                                        for (const file of files) {
                                            const path = `services/${Date.now()}-${sanitizeFileName(file.name)}`
                                            const url = await uploadMedia({ file, path })
                                            urls.push(url)
                                        }
                                        setValue('images', [...images, ...urls], { shouldDirty: true })
                                    } catch (e) {
                                        console.error(e)
                                        alert("Erro ao enviar imagens")
                                    } finally {
                                        setUploading(false)
                                    }
                                }}
                                onRemove={(index) => {
                                    setValue('images', images.filter((_, i) => i !== index), { shouldDirty: true })
                                }}
                                label="Arraste imagens aqui (Max 8)"
                                disabled={uploading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Vídeos Demonstrativos</Label>
                            <FileUpload
                                accept={{ 'video/*': [] }}
                                maxFiles={3}
                                value={videos}
                                onChange={async (files) => {
                                    if (files.length === 0) return
                                    setUploading(true)
                                    try {
                                        const urls: string[] = []
                                        for (const file of files) {
                                            const path = `services/${Date.now()}-${sanitizeFileName(file.name)}`
                                            const url = await uploadMedia({ file, path })
                                            urls.push(url)
                                        }
                                        setValue('videos', [...videos, ...urls], { shouldDirty: true })
                                    } catch (e) {
                                        console.error(e)
                                        alert("Erro ao enviar vídeos")
                                    } finally {
                                        setUploading(false)
                                    }
                                }}
                                onRemove={(index) => {
                                    setValue('videos', videos.filter((_, i) => i !== index), { shouldDirty: true })
                                }}
                                label="Arraste vídeos aqui (Max 3)"
                                disabled={uploading}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Otimização para Buscas (SEO)</CardTitle>
                        <CardDescription>
                            Melhore a visibilidade deste serviço no Google.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="seo_title">SEO Título</Label>
                            <Input id="seo_title" placeholder="Título para aparecer no Google" {...register('seo_title')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seo_description">SEO Descrição</Label>
                            <Textarea
                                id="seo_description"
                                placeholder="Descrição para aparecer no Google"
                                {...register('seo_description')}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4 sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t mt-8 z-10 transition-all">
                <Button type="button" variant="ghost" onClick={() => navigate('/admin/services')}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading || uploading}>
                    {(isLoading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {uploading ? 'Enviando arquivos...' : 'Salvar Serviço'}
                </Button>
            </div>
        </form>
    )
}
