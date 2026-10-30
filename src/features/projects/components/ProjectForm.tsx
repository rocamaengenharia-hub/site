import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { Loader2 } from 'lucide-react'
import { sanitizeFileName } from '../../../lib/utils'
import { useNavigate } from 'react-router-dom'
import { FileUpload } from '../../../components/ui/file-upload'
import { useUploadProjectMedia } from '../useProjects'
import { Switch } from '../../../components/ui/switch'
import { useServices } from '../../services/useServices'

const projectSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9-]+$/, 'Slug inválido (apenas letras minúsculas e hífen)'),
    description: z.string().optional(),
    location: z.string().optional(),
    service_id: z.string().optional(),
    is_featured: z.boolean(),
    main_image: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    gallery_project: z.array(z.string()).optional(),
    gallery_process: z.array(z.string()).optional(),
    show_gallery_project: z.boolean(),
    show_gallery_process: z.boolean(),
    cover_position: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
    initialData?: ProjectFormData
    onSubmit: (data: ProjectFormData) => Promise<void>
    isLoading?: boolean
}

export const ProjectForm = ({ initialData, onSubmit, isLoading }: ProjectFormProps) => {
    const navigate = useNavigate()
    const { mutateAsync: uploadMedia } = useUploadProjectMedia()
    const { data: services } = useServices()
    const [uploading, setUploading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            is_featured: false,
            show_gallery_project: false,
            show_gallery_process: false,
            title: '',
            slug: '',
            description: '',
            location: '',
            gallery: [],
            gallery_project: [],
            gallery_process: [],
            ...initialData
        }
    })

    const galleryProject = watch('gallery_project') || []
    const galleryProcess = watch('gallery_process') || []
    const mainImage = watch('main_image')

    const handleFormSubmit = async (data: ProjectFormData) => {
        // Just ensure arrays are present if they were undefined
        const finalData: ProjectFormData = {
            ...data,
            gallery: data.gallery || [],
            gallery_project: data.gallery_project || [],
            gallery_process: data.gallery_process || [],
        }
        await onSubmit(finalData)
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 max-w-5xl mx-auto">
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Dados da Obra</CardTitle>
                        <CardDescription>
                            Detalhes principais do projeto realizado.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center space-x-2 col-span-2 mb-4 bg-muted/50 p-3 rounded-lg border">
                            <Switch
                                id="is_featured"
                                checked={watch('is_featured')}
                                onCheckedChange={(checked) => setValue('is_featured', checked)}
                            />
                            <Label htmlFor="is_featured" className="cursor-pointer">
                                Destaque (Aparecer na Home como Destaque)
                            </Label>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Nome da Obra</Label>
                            <Input id="title" placeholder="Ex: Residência Alphaville" {...register('title')} />
                            {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input id="slug" placeholder="ex: residencia-alphaville" {...register('slug')} />
                            {errors.slug && <p className="text-destructive text-xs">{errors.slug.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Localização</Label>
                            <Input id="location" placeholder="Ex: São Paulo, SP" {...register('location')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="service_id">Serviço Relacionado</Label>
                            <select
                                id="service_id"
                                {...register('service_id')}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">-- Selecione um serviço --</option>
                                {services?.map(service => (
                                    <option key={service.id} value={service.id}>{service.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="description">Descrição do Projeto</Label>
                            <Textarea
                                id="description"
                                placeholder="Detalhes da execução, desafios, soluções..."
                                className="min-h-[120px]"
                                {...register('description')}
                            />
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
                                    const path = `projects/cover-${Date.now()}-${sanitizeFileName(file.name)}`
                                    const url = await uploadMedia({ file, path })
                                    setValue('main_image', url, { shouldDirty: true })
                                } catch (e) {
                                    console.error(e)
                                    alert("Erro ao enviar imagem")
                                } finally {
                                    setUploading(false)
                                }
                            }}
                            onRemove={() => setValue('main_image', '', { shouldDirty: true })}
                            label="Imagem de Capa"
                            disabled={uploading}
                        />

                        {mainImage && (
                            <div className="mt-4 space-y-2">
                                <Label>Posição da imagem no banner</Label>
                                <select
                                    {...register('cover_position')}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="center">Centro (padrão)</option>
                                    <option value="top">Topo</option>
                                    <option value="bottom">Base</option>
                                </select>
                                <div className="relative w-full h-32 rounded-lg overflow-hidden border bg-slate-100 mt-2">
                                    <img
                                        src={mainImage}
                                        alt="Preview posição"
                                        className="w-full h-full object-cover"
                                        style={{ objectPosition: watch('cover_position') || 'center' }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Escolha como a imagem fica posicionada no banner da obra.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Projeto da Obra</CardTitle>
                                <CardDescription>Imagens do projeto (3D, plantas, renderizações). Máximo 50 fotos.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="show_gallery_project" className="text-sm text-muted-foreground">Exibir no site</Label>
                                <Switch
                                    id="show_gallery_project"
                                    checked={watch('show_gallery_project')}
                                    onCheckedChange={(checked) => setValue('show_gallery_project', checked, { shouldDirty: true })}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground mb-3">{galleryProject.length}/50 fotos</div>
                        <FileUpload
                            accept={{ 'image/*': [] }}
                            maxFiles={50}
                            value={galleryProject}
                            onChange={async (files) => {
                                if (files.length === 0) return
                                if (galleryProject.length + files.length > 50) {
                                    alert('Limite de 50 fotos atingido.')
                                    return
                                }
                                setUploading(true)
                                try {
                                    const urls: string[] = []
                                    for (const file of files) {
                                        const path = `projects/project-${Date.now()}-${sanitizeFileName(file.name)}`
                                        const url = await uploadMedia({ file, path })
                                        urls.push(url)
                                    }
                                    setValue('gallery_project', [...galleryProject, ...urls], { shouldDirty: true })
                                } catch (e) {
                                    console.error(e)
                                    alert("Erro ao enviar imagens")
                                } finally {
                                    setUploading(false)
                                }
                            }}
                            onRemove={(index) => {
                                setValue('gallery_project', galleryProject.filter((_, i) => i !== index), { shouldDirty: true })
                            }}
                            label="Arraste imagens do projeto aqui (Max 50)"
                            disabled={uploading}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Processo da Obra</CardTitle>
                                <CardDescription>Fotos de todo o processo construtivo. Máximo 50 fotos.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="show_gallery_process" className="text-sm text-muted-foreground">Exibir no site</Label>
                                <Switch
                                    id="show_gallery_process"
                                    checked={watch('show_gallery_process')}
                                    onCheckedChange={(checked) => setValue('show_gallery_process', checked, { shouldDirty: true })}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground mb-3">{galleryProcess.length}/50 fotos</div>
                        <FileUpload
                            accept={{ 'image/*': [] }}
                            maxFiles={50}
                            value={galleryProcess}
                            onChange={async (files) => {
                                if (files.length === 0) return
                                if (galleryProcess.length + files.length > 50) {
                                    alert('Limite de 50 fotos atingido.')
                                    return
                                }
                                setUploading(true)
                                try {
                                    const urls: string[] = []
                                    for (const file of files) {
                                        const path = `projects/process-${Date.now()}-${sanitizeFileName(file.name)}`
                                        const url = await uploadMedia({ file, path })
                                        urls.push(url)
                                    }
                                    setValue('gallery_process', [...galleryProcess, ...urls], { shouldDirty: true })
                                } catch (e) {
                                    console.error(e)
                                    alert("Erro ao enviar imagens")
                                } finally {
                                    setUploading(false)
                                }
                            }}
                            onRemove={(index) => {
                                setValue('gallery_process', galleryProcess.filter((_, i) => i !== index), { shouldDirty: true })
                            }}
                            label="Arraste fotos do processo aqui (Max 50)"
                            disabled={uploading}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4 sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t mt-8 z-10 transition-all">
                <Button type="button" variant="ghost" onClick={() => navigate('/admin/projects')}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading || uploading}>
                    {(isLoading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {uploading ? 'Enviando arquivos...' : 'Salvar Obra'}
                </Button>
            </div>
        </form>
    )
}
