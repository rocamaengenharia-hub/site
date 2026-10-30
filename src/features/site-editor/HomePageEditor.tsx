import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Loader2, Save, Plus, Trash2, Video, Image as ImageIcon } from 'lucide-react'
import { FileUpload } from '../../components/ui/file-upload'
import { sanitizeFileName } from '../../lib/utils'
import { useUploadProjectMedia } from '../projects/useProjects'
import { usePageContent, useUpdatePageContent } from './useSiteContent'
import { useProjects } from '../projects/useProjects'

interface HeroSlide {
    id: number
    type: 'image' | 'video'
    image: string // URL
    title: string
    subtitle: string
    project_id?: string // Link to a project
}

interface HomeHeroContent {
    slides: HeroSlide[]
}

export const HomePageEditor = () => {
    const { data: pageData, isLoading } = usePageContent('home', 'hero')
    const { mutateAsync: updateContent, isPending: isSaving } = useUpdatePageContent()
    const { mutateAsync: uploadMedia } = useUploadProjectMedia()
    const { data: projects } = useProjects() // Fetch available projects

    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

    const { register, control, handleSubmit, setValue, watch, reset } = useForm<HomeHeroContent>({
        defaultValues: {
            slides: []
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "slides"
    })

    useEffect(() => {
        if (pageData?.content?.slides) {
            reset({ slides: pageData.content.slides })
        } else if (pageData?.content && !pageData.content.slides) {
            // Migration: if old single image data exists but no slides, create one slide
            const oldContent = pageData.content
            if (oldContent.hero_bg_image) {
                reset({
                    slides: [{
                        id: 1,
                        type: 'image',
                        image: oldContent.hero_bg_image,
                        title: oldContent.hero_title || '',
                        subtitle: oldContent.hero_subtitle || ''
                    }]
                })
            }
        }
    }, [pageData, reset])

    const onSubmit = async (data: HomeHeroContent) => {
        const slidesInvalidos = data.slides.filter(s => !s.project_id)
        if (slidesInvalidos.length > 0) {
            alert('Todos os slides precisam estar vinculados a uma obra. Verifique os slides sem vínculo.')
            return
        }

        try {
            await updateContent({
                slug: 'home',
                section: 'hero',
                content: { slides: data.slides }
            })
            alert('Carousel da Home atualizado!')
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar.')
        }
    }

    const handleUpload = async (files: File[], index: number) => {
        if (files.length > 0) {
            setUploadingIndex(index)
            try {
                const file = files[0]
                const path = `site/home/hero-slide-${Date.now()}-${sanitizeFileName(file.name)}`
                const url = await uploadMedia({ file, path })

                const isVideo = file.type.startsWith('video/')
                setValue(`slides.${index}.image`, url, { shouldDirty: true })
                setValue(`slides.${index}.type`, isVideo ? 'video' : 'image', { shouldDirty: true })
            } catch (e) {
                console.error(e)
                alert("Erro ao enviar mídia")
            } finally {
                setUploadingIndex(null)
            }
        }
    }

    if (isLoading) return <div>Carregando...</div>

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Carrossel da Home</CardTitle>
                    <CardDescription>
                        Adicione imagens ou vídeos curtos para o banner principal.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {fields.map((field, index) => {
                        const currentImage = watch(`slides.${index}.image`)
                        const currentType = watch(`slides.${index}.type`)

                        return (
                            <div key={field.id} className="relative border p-4 rounded-lg bg-slate-50">
                                <div className="absolute top-2 right-2">
                                    <Button variant="destructive" size="sm" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <h4 className="font-bold mb-4 text-sm uppercase text-muted-foreground">Slide {index + 1}</h4>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <Label>Mídia (Imagem ou Vídeo)</Label>

                                        {currentImage && (
                                            <div className="relative w-full aspect-video border rounded-lg overflow-hidden bg-black">
                                                {currentType === 'video' || currentImage?.match(/\.(mp4|webm|ogg)$/i) ? (
                                                    <video src={currentImage} className="w-full h-full object-cover" autoPlay muted loop />
                                                ) : (
                                                    <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        )}

                                        <FileUpload
                                            accept={{
                                                'image/*': [],
                                                'video/mp4': [],
                                                'video/webm': []
                                            }}
                                            maxFiles={1}
                                            value={[]}
                                            onChange={(files) => handleUpload(files, index)}
                                            label={uploadingIndex === index ? "Enviando..." : "Alterar Mídia"}
                                            disabled={uploadingIndex === index}
                                        />
                                        <div className="flex gap-2 text-xs text-muted-foreground">
                                            {currentType === 'video' ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                                            Tipo detectado: {currentType === 'video' ? 'Vídeo' : 'Imagem'}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2 bg-white p-3 rounded border border-primary/20 shadow-sm">
                                            <Label className="text-primary font-bold">Vincular a uma Obra Realizada</Label>
                                            <select
                                                {...register(`slides.${index}.project_id` as const, {
                                                    required: "Vínculo obrigatório",
                                                    onChange: (e) => {
                                                        const proj = projects?.find(p => p.id === e.target.value);
                                                        if (proj) {
                                                            if (!watch(`slides.${index}.title`)) setValue(`slides.${index}.title`, proj.title.toUpperCase());
                                                            if (proj.main_image && !watch(`slides.${index}.image`)) {
                                                                setValue(`slides.${index}.image`, proj.main_image);
                                                                setValue(`slides.${index}.type`, 'image');
                                                            }
                                                        }
                                                    }
                                                })}
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="">-- Selecione a Obra --</option>
                                                {projects?.map((project) => (
                                                    <option key={project.id} value={project.id}>
                                                        {project.title}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="text-[10px] text-primary font-medium mt-1">
                                                Obrigatório. Este banner levará o visitante para os detalhes desta obra específica.
                                            </p>
                                        </div>

                                        {/* Media Picker from Project */}
                                        {watch(`slides.${index}.project_id`) && (
                                            <div className="space-y-2">
                                                <Label className="text-xs uppercase font-bold text-muted-foreground">Escolher Mídia da Obra</Label>
                                                <div className="grid grid-cols-4 gap-2 border rounded-lg p-2 bg-white max-h-40 overflow-y-auto">
                                                    {projects?.find(p => p.id === watch(`slides.${index}.project_id`))?.main_image && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const url = projects?.find(p => p.id === watch(`slides.${index}.project_id`))?.main_image
                                                                if (url) {
                                                                    setValue(`slides.${index}.image`, url)
                                                                    setValue(`slides.${index}.type`, 'image')
                                                                }
                                                            }}
                                                            className={`relative aspect-square rounded border-2 overflow-hidden hover:opacity-80 transition-all ${currentImage === projects?.find(p => p.id === watch(`slides.${index}.project_id`))?.main_image ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                                                        >
                                                            <img src={projects?.find(p => p.id === watch(`slides.${index}.project_id`))?.main_image} className="w-full h-full object-cover" alt="Main" />
                                                            <div className="absolute top-0 right-0 bg-primary/90 text-[10px] text-white px-1 font-bold">Capa</div>
                                                        </button>
                                                    )}
                                                    {projects?.find(p => p.id === watch(`slides.${index}.project_id`))?.gallery?.map((url, i) => (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            onClick={() => {
                                                                setValue(`slides.${index}.image`, url)
                                                                const isVideo = url?.match(/\.(mp4|webm|ogg)$/i)
                                                                setValue(`slides.${index}.type`, isVideo ? 'video' : 'image')
                                                            }}
                                                            className={`relative aspect-square rounded border-2 overflow-hidden hover:opacity-80 transition-all ${currentImage === url ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                                                        >
                                                            {url?.match(/\.(mp4|webm|ogg)$/i) ? (
                                                                <video src={url} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <img src={url} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-muted-foreground italic">Clique em imagem da obra para usá-la no banner.</p>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label>Título Principal</Label>
                                            <Input {...register(`slides.${index}.title` as const)} placeholder="Ex: OBRA RESIDENCIAL" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Subtítulo / Categoria</Label>
                                            <Input {...register(`slides.${index}.subtitle` as const)} placeholder="Ex: Alto Padrão" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ id: Date.now(), type: 'image', image: '', title: '', subtitle: '' })}
                        className="w-full border-dashed py-8"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Novo Slide
                    </Button>
                </CardContent>
            </Card>

            <Button type="submit" disabled={isSaving || uploadingIndex !== null} className="w-full md:w-auto">
                {(isSaving || uploadingIndex !== null) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
            </Button>
        </form>
    )
}
