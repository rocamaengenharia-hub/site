import { useNavigate, useParams } from "react-router-dom"
import { PostForm } from "./components/PostForm"
import { usePost, useUpdatePost } from "./usePosts"
import { Loader2 } from "lucide-react"

export const EditPostPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { data: post, isLoading } = usePost(id!)
    const { mutateAsync: updatePost, isPending } = useUpdatePost()

    const handleSubmit = async (data: any) => {
        try {
            await updatePost({ id: id!, ...data })
            navigate('/admin/blog')
        } catch (error) {
            console.error(error)
            alert("Erro ao atualizar artigo")
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight uppercase font-heading">Editar Artigo</h1>
                <p className="text-muted-foreground">Atualize o conteúdo e as configurações de SEO.</p>
            </div>

            <PostForm
                initialData={post}
                onSubmit={handleSubmit}
                isLoading={isPending}
            />
        </div>
    )
}
