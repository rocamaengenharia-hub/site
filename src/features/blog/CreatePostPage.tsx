import { useNavigate } from "react-router-dom"
import { PostForm } from "./components/PostForm"
import { useCreatePost } from "./usePosts"

export const CreatePostPage = () => {
    const navigate = useNavigate()
    const { mutateAsync: createPost, isPending } = useCreatePost()

    const handleSubmit = async (data: any) => {
        try {
            await createPost(data)
            navigate('/admin/blog')
        } catch (error) {
            console.error(error)
            alert("Erro ao criar artigo")
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight uppercase font-heading">Novo Artigo</h1>
                <p className="text-muted-foreground">Crie um novo conteúdo otimizado para o blog.</p>
            </div>

            <PostForm onSubmit={handleSubmit} isLoading={isPending} />
        </div>
    )
}
