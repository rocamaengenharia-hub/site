import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"
import { PostsList } from "./components/PostsList"

export const AdminPostsPage = () => {
    const navigate = useNavigate()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight uppercase font-heading">Blog / Artigos</h1>
                    <p className="text-muted-foreground">Gerencie o conteúdo do blog focado em SEO.</p>
                </div>
                <Button onClick={() => navigate('/admin/blog/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Novo Artigo
                </Button>
            </div>

            <PostsList />
        </div>
    )
}
