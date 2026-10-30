import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../../components/ui/table"
import { usePosts, useDeletePost } from "../usePosts"
import { Button } from "../../../components/ui/button"
import { Edit, Trash2, Eye, Circle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "../../../lib/utils"

export const PostsList = () => {
    const navigate = useNavigate()
    const { data: posts, isLoading } = usePosts()
    const { mutateAsync: deletePost } = useDeletePost()

    if (isLoading) return <div>Carregando artigos...</div>

    if (!posts || posts.length === 0) {
        return <div className="text-muted-foreground text-center p-4">Nenhum artigo encontrado.</div>
    }

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este artigo?')) {
            await deletePost(id)
        }
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Data de Publicação</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts.map((post) => (
                        <TableRow key={post.id}>
                            <TableCell>
                                <span className={cn(
                                    "inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                                    post.is_published
                                        ? "bg-green-100 text-green-700"
                                        : "bg-amber-100 text-amber-700"
                                )}>
                                    <Circle className={cn("h-2 w-2 fill-current", post.is_published ? "text-green-500" : "text-amber-500")} />
                                    {post.is_published ? 'Publicado' : 'Rascunho'}
                                </span>
                            </TableCell>
                            <TableCell className="font-medium max-w-[300px] truncate">{post.title}</TableCell>
                            <TableCell className="text-muted-foreground">{post.category?.title || '-'}</TableCell>
                            <TableCell className="text-muted-foreground">
                                {new Date(post.published_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Ver no Site"
                                    asChild
                                >
                                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                        <Eye className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Editar Artigo"
                                    onClick={() => navigate(`/admin/blog/${post.id}/edit`)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Excluir"
                                    onClick={() => handleDelete(post.id)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
