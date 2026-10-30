import { useParams, useNavigate } from "react-router-dom"
import { usePost } from "./usePosts"
import { User, ArrowLeft, Loader2, Share2, Printer } from "lucide-react"
import { FinalCTASection } from "../public/components/FinalCTASection"
import { useEffect } from "react"
import DOMPurify from 'dompurify'

export const PublicPostDetailsPage = () => {
    const { slug } = useParams<{ slug: string }>()
    const navigate = useNavigate()
    const { data: post, isLoading } = usePost(slug!)

    // Update SEO tags dynamically
    useEffect(() => {
        if (post) {
            document.title = `${post.seo_title || post.title} | Rocama Engenharia`

            const metaDesc = document.querySelector('meta[name="description"]')
            if (metaDesc) {
                metaDesc.setAttribute('content', post.seo_description || post.excerpt || '')
            }
        }
    }, [post])

    if (isLoading) {
        return (
            <div className="py-64 flex justify-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!post) {
        return (
            <div className="py-64 text-center bg-white">
                <h1 className="text-4xl font-heading font-black mb-4">Artigo não encontrado</h1>
                <button onClick={() => navigate('/blog')} className="text-primary font-mono text-sm uppercase tracking-widest hover:underline">
                    Ver todos os artigos
                </button>
            </div>
        )
    }

    return (
        <article className="bg-white min-h-screen">
            {/* Header Hero */}
            <header className="relative py-32 md:py-48 bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="container mx-auto px-6 relative z-10">
                    <button
                        onClick={() => navigate('/blog')}
                        className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest mb-12 hover:-translate-x-2 transition-transform"
                    >
                        <ArrowLeft className="h-4 w-4" /> Voltar ao Blog
                    </button>

                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="bg-primary text-slate-950 font-mono text-xs px-3 py-1 font-black uppercase tracking-tighter">
                                {post.category?.title || "ENGENHARIA"}
                            </span>
                            <div className="text-slate-500 font-mono text-xs uppercase tracking-widest">
                                Publicado em: {new Date(post.published_at).toLocaleDateString('pt-BR')}
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-heading font-black text-white leading-[0.85] uppercase tracking-tighter mb-12">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-slate-400 font-mono text-xs uppercase tracking-widest border-t border-white/5 pt-8">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                <span>Escrito por: {post.author_name}</span>
                            </div>
                            {/* Actions */}
                            <div className="flex items-center gap-4 ml-auto">
                                <button className="hover:text-white transition-colors flex items-center gap-2">
                                    <Printer className="h-4 w-4" /> Imprimir
                                </button>
                                <button className="hover:text-white transition-colors flex items-center gap-2">
                                    <Share2 className="h-4 w-4" /> Compartilhar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-24">
                <div className="max-w-4xl mx-auto">
                    {/* Main Image */}
                    {post.main_image && (
                        <div className="aspect-[21/9] mb-16 overflow-hidden rounded-lg bg-slate-100 shadow-2xl relative">
                            <img src={post.main_image} alt={post.title} className="w-full h-full object-cover" />
                            {/* Dimension lines deco */}
                            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-primary/50" />
                            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-primary/50" />
                        </div>
                    )}

                    {/* Excerpt/Lead */}
                    {post.excerpt && (
                        <div className="text-xl md:text-2xl font-light text-slate-600 border-l-4 border-primary pl-8 mb-16 italic leading-relaxed">
                            {post.excerpt}
                        </div>
                    )}

                    {/* Body Content */}
                    <div
                        className="prose prose-slate prose-lg max-w-none 
                            prose-headings:font-heading prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
                            prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8
                            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-8
                            prose-img:rounded-lg prose-img:shadow-lg
                            prose-strong:text-slate-900 prose-strong:font-black
                            prose-ul:list-disc prose-ul:pl-6
                            prose-blockquote:border-l-primary prose-blockquote:font-light prose-blockquote:italic
                            /* Fallback styles in case typography plugin is not active */
                            [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:uppercase [&>h2]:text-slate-900
                            [&>p]:mb-6 [&>p]:text-slate-700 [&>p]:leading-relaxed
                            [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:my-10
                        "
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '') }}
                    />
                </div>
            </div>

            <FinalCTASection />
        </article>
    )
}
