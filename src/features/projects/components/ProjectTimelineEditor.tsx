
import { useEffect, useState } from 'react'
import {
    useProjectTimeline,
    useUpdateProjectTimelineOrder,
    useCreateProjectTimelineEvent,
    useDeleteProjectTimelineEvent,
    useUploadProjectTimelineMedia,
    useUpdateProjectTimelineEvent,
    type TimelineEvent
} from '../useProjectTimeline'
import { Button } from '../../../components/ui/button'
import { Plus, Trash2, GripVertical, Loader2, FileVideo, Pencil } from 'lucide-react'
import { sanitizeFileName } from '../../../lib/utils'
import { Card, CardContent } from '../../../components/ui/card'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { FileUpload } from "../../../components/ui/file-upload"

interface ProjectTimelineEditorProps {
    projectId: string
}

const SortableTimelineItem = ({ event, onDelete, onEdit }: { event: TimelineEvent, onDelete: (id: string) => void, onEdit: (event: TimelineEvent) => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: event.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style}>
            <Card className="bg-card">
                <CardContent className="p-4 flex items-center gap-4">
                    <div {...attributes} {...listeners} className="cursor-move touch-none">
                        <GripVertical className="bg-muted text-muted-foreground h-5 w-5" />
                    </div>

                    {/* Media Preview Stack */}
                    <div className="flex -space-x-2 overflow-hidden shrink-0">
                        {(event.images || []).slice(0, 3).map((img, i) => (
                            <img
                                key={`img-${i}`}
                                src={img}
                                alt={event.title}
                                className="h-12 w-12 rounded border-2 border-background object-cover"
                            />
                        ))}
                        {(event.videos || []).slice(0, 2).map((_, i) => (
                            <div key={`vid-${i}`} className="h-12 w-12 rounded border-2 border-background bg-slate-900 flex items-center justify-center">
                                <FileVideo className="h-5 w-5 text-white" />
                            </div>
                        ))}
                        {(!event.images?.length && !event.videos?.length && event.image_url) && (
                            <img src={event.image_url} alt={event.title} className="h-12 w-12 rounded object-cover" />
                        )}
                        {(!event.images?.length && !event.videos?.length && !event.image_url) && (
                            <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">Sem mídia</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">{event.description}</p>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onEdit(event)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => onDelete(event.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export const ProjectTimelineEditor = ({ projectId }: ProjectTimelineEditorProps) => {
    const { data: events, isLoading } = useProjectTimeline(projectId)
    const { mutate: updateOrder } = useUpdateProjectTimelineOrder()
    const { mutateAsync: createEvent, isPending: isCreating } = useCreateProjectTimelineEvent()
    const { mutateAsync: updateEvent, isPending: isUpdating } = useUpdateProjectTimelineEvent()
    const { mutateAsync: deleteEvent } = useDeleteProjectTimelineEvent()
    const { mutateAsync: uploadMedia } = useUploadProjectTimelineMedia()

    const [items, setItems] = useState<TimelineEvent[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [newEvent, setNewEvent] = useState<{
        title: string
        description: string
        image_url: string
        video_url: string
        images: string[]
        videos: string[]
    }>({
        title: '',
        description: '',
        image_url: '',
        video_url: '',
        images: [],
        videos: []
    })

    useEffect(() => {
        if (events) {
            setItems(events)
        }
    }, [events])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)

                const newItems = arrayMove(items, oldIndex, newIndex)

                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    display_order: index
                }))

                updateOrder(updates)

                return newItems
            })
        }
    }

    const resetForm = () => {
        setNewEvent({ title: '', description: '', image_url: '', video_url: '', images: [], videos: [] })
        setEditingId(null)
        setIsDialogOpen(false)
    }

    const handleEditEvent = (event: TimelineEvent) => {
        setEditingId(event.id)
        setNewEvent({
            title: event.title,
            description: event.description,
            image_url: event.image_url || '',
            video_url: event.video_url || '',
            images: event.images || [],
            videos: event.videos || []
        })
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingId) {
                await updateEvent({
                    id: editingId,
                    project_id: projectId,
                    title: newEvent.title,
                    description: newEvent.description,
                    image_url: newEvent.image_url || (newEvent.images.length > 0 ? newEvent.images[0] : ''),
                    video_url: newEvent.video_url || (newEvent.videos.length > 0 ? newEvent.videos[0] : ''),
                    images: newEvent.images,
                    videos: newEvent.videos,
                })
            } else {
                await createEvent({
                    project_id: projectId,
                    title: newEvent.title,
                    description: newEvent.description,
                    image_url: newEvent.image_url || (newEvent.images.length > 0 ? newEvent.images[0] : ''),
                    video_url: newEvent.video_url || (newEvent.videos.length > 0 ? newEvent.videos[0] : ''),
                    images: newEvent.images,
                    videos: newEvent.videos,
                    display_order: items.length
                })
            }
            resetForm()
        } catch (error) {
            console.error(error)
            alert(editingId ? 'Erro ao atualizar etapa' : 'Erro ao criar etapa')
        }
    }

    const handleDeleteEvent = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta etapa?')) {
            try {
                await deleteEvent({ id, projectId })
            } catch (error) {
                console.error(error)
                alert('Erro ao excluir etapa')
            }
        }
    }

    if (isLoading) return <div>Carregando linha do tempo...</div>

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-900 uppercase tracking-tight">Evolução da Obra</h3>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) resetForm()
                }}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => resetForm()}>
                            <Plus className="mr-2 h-4 w-4" /> Adicionar Etapa
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Editar Etapa' : 'Adicionar Nova Etapa'}</DialogTitle>
                            <DialogDescription>
                                {editingId ? 'Edite os detalhes desta etapa da obra.' : 'Crie uma nova etapa para a linha do tempo desta obra.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título da Etapa</Label>
                                <Input
                                    id="title"
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                    required
                                    placeholder="Ex: Fundação, Alvenaria, Acabamento..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">O que foi feito?</Label>
                                <Textarea
                                    id="description"
                                    value={newEvent.description}
                                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                    placeholder="Descreva o progresso alcançado nesta etapa..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Imagens da Etapa</Label>
                                <FileUpload
                                    accept={{ 'image/*': [] }}
                                    maxFiles={5}
                                    value={newEvent.images}
                                    onChange={async (files) => {
                                        if (files.length === 0) return
                                        const urls: string[] = []
                                        setUploading(true)
                                        try {
                                            for (const file of files) {
                                                const path = `timeline/${projectId}/${Date.now()}-${sanitizeFileName(file.name)}`
                                                const url = await uploadMedia({ file, path })
                                                urls.push(url)
                                            }
                                            setNewEvent(prev => ({
                                                ...prev,
                                                images: [...prev.images, ...urls]
                                            }))
                                        } catch (e) {
                                            console.error(e)
                                            alert("Erro ao enviar imagens")
                                        } finally {
                                            setUploading(false)
                                        }
                                    }}
                                    onRemove={(index) => {
                                        setNewEvent(prev => ({
                                            ...prev,
                                            images: prev.images.filter((_, i) => i !== index)
                                        }))
                                    }}
                                    label="Arraste imagens aqui (Max 5)"
                                    disabled={uploading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Vídeos da Etapa</Label>
                                <FileUpload
                                    accept={{ 'video/*': [] }}
                                    maxFiles={2}
                                    value={newEvent.videos}
                                    onChange={async (files) => {
                                        if (files.length === 0) return
                                        const urls: string[] = []
                                        setUploading(true)
                                        try {
                                            for (const file of files) {
                                                const path = `timeline/${projectId}/${Date.now()}-${sanitizeFileName(file.name)}`
                                                const url = await uploadMedia({ file, path })
                                                urls.push(url)
                                            }
                                            setNewEvent(prev => ({
                                                ...prev,
                                                videos: [...prev.videos, ...urls]
                                            }))
                                        } catch (e) {
                                            console.error(e)
                                            alert("Erro ao enviar vídeos")
                                        } finally {
                                            setUploading(false)
                                        }
                                    }}
                                    onRemove={(index) => {
                                        setNewEvent(prev => ({
                                            ...prev,
                                            videos: prev.videos.filter((_, i) => i !== index)
                                        }))
                                    }}
                                    label="Arraste vídeos aqui (Max 2)"
                                    disabled={uploading}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={isCreating || isUpdating || uploading}>
                                    {(isCreating || isUpdating || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingId ? 'Salvar Alterações' : 'Adicionar Etapa'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-2">
                {items.length === 0 && (
                    <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md text-center">
                        Nenhuma etapa cadastrada para esta obra.
                    </div>
                )}

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {items.map((event) => (
                                <SortableTimelineItem
                                    key={event.id}
                                    event={event}
                                    onDelete={handleDeleteEvent}
                                    onEdit={handleEditEvent}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    )
}
