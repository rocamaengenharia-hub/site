import { Calendar, User, ArrowRight, Loader2 } from "lucide-react"
import { usePosts } from "../usePosts"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export const BlogCatalog = () => {
    const { data: posts, isLoading } = usePosts({ is_published: true })
    const navigate = useNavigate()

    if (isLoading) {
        return (
            <div className="py-32 flex justify-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="py-32 text-center bg-white border-t border-slate-100">
                <p className="font-mono text-slate-400 uppercase tracking-widest text-sm">
                    Nenhum artigo publicado ainda
                </p>
            </div>
        )
    }

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {posts.map((post, idx) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="group flex flex-col bg-white overflow-hidden"
                        >
                            {/* Image Container */}
                            <div
                                className="relative aspect-[16/10] overflow-hidden bg-slate-100 mb-6 cursor-pointer"
                                onClick={() => navigate(`/blog/${post.slug}`)}
                            >
                                <img
                                    src={post.main_image || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2700&auto=format&fit=crop"}
                                    alt={post.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-primary text-slate-950 font-mono text-xs px-3 py-1 font-black uppercase tracking-tighter">
                                        {post.category?.title || "ENGENHARIA"}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-grow">
                                <div className="flex items-center gap-4 mb-4 text-xs font-mono text-slate-400 uppercase tracking-[0.2em]">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-primary" />
                                        <span>{new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-3.5 w-3.5 text-primary" />
                                        <span>{post.author_name}</span>
                                    </div>
                                </div>

                                <h2
                                    className="text-2xl md:text-3xl font-heading font-black text-slate-900 leading-none uppercase tracking-tighter mb-4 group-hover:text-primary transition-colors cursor-pointer line-clamp-2"
                                    onClick={() => navigate(`/blog/${post.slug}`)}
                                >
                                    {post.title}
                                </h2>

                                <p className="text-slate-500 text-sm font-light leading-relaxed mb-8 line-clamp-3">
                                    {post.excerpt || "Leia mais sobre este projeto e os desafios técnicos superados pela nossa equipe..."}
                                </p>

                                <button
                                    onClick={() => navigate(`/blog/${post.slug}`)}
                                    className="mt-auto flex items-center gap-2 font-mono text-sm font-black uppercase tracking-widest text-slate-900 group-hover:translate-x-2 transition-transform duration-300"
                                >
                                    Ler artigo completo
                                    <ArrowRight className="h-4 w-4 text-primary" />
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    )
}
