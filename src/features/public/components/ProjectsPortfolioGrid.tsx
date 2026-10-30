import { motion } from "framer-motion"
import { ArrowRight, Loader2, MapPin, Plus } from "lucide-react"
import { useProjects } from "../../projects/useProjects"
import { useNavigate } from "react-router-dom"

export const ProjectsPortfolioGrid = () => {
    const { data: allProjects, isLoading } = useProjects()
    const navigate = useNavigate()

    const projects = allProjects?.slice().sort((a, b) =>
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    ).slice(0, 4) || []

    if (isLoading) {
        return (
            <div className="py-24 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        )
    }

    if (projects.length === 0) return null

    return (
        <section className="py-24 bg-white relative overflow-hidden" id="portfolio-grid">
            {/* Technical ruler at the top */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-200" />
            <div className="absolute top-0 left-0 h-4 w-[1px] bg-slate-400" />
            <div className="absolute top-0 right-0 h-4 w-[1px] bg-slate-400" />

            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-2">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 border-b border-slate-200 pb-2 mb-2">
                            <div className="w-2 h-2 bg-primary"></div>
                            <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">Nossas Obras</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 leading-[0.9] uppercase tracking-tighter">
                            PROJETOS<br />
                            <span className="text-slate-400">RECENTES.</span>
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/projetos')}
                        className="hidden md:flex items-center gap-3 font-heading font-bold uppercase tracking-widest text-xs h-14 px-8 bg-slate-900 text-white hover:bg-primary transition-all duration-500 rounded-none group"
                    >
                        <span>Ver Portfólio Completo</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-slate-200">
                    {projects.map((project, idx) => {
                        const number = (idx + 1).toString().padStart(2, '0')

                        return (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="group relative bg-white p-8 border-r border-b border-slate-200 overflow-hidden cursor-pointer"
                                onClick={() => navigate(`/projetos/${project.id}`)}
                            >
                                {/* Technical ID Hover Backdrop */}
                                <div className="absolute top-0 right-0 p-4 font-mono text-[60px] font-black text-slate-50 leading-none select-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
                                    {number}
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    {/* Image Section */}
                                    <div className="relative aspect-video mb-8 overflow-hidden bg-slate-100 group">
                                        <img
                                            src={project.main_image || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2700&auto=format&fit=crop"}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                            <div className="bg-white p-3 rounded-full shadow-xl">
                                                <Plus className="w-5 h-5 text-primary" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest whitespace-nowrap overflow-hidden">
                                            <MapPin className="h-3 w-3 shrink-0" />
                                            <span className="truncate">{project.location || "Local não informado"}</span>
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <h3 className="text-xl font-heading font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors duration-300 uppercase leading-snug">
                                            {project.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-light leading-relaxed mb-8 line-clamp-2">
                                            {project.description || 'Descrição em breve.'}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Obra Concluída</span>
                                        </div>
                                        <div className="group/btn flex items-center gap-2 text-slate-900 font-bold text-sm uppercase tracking-[0.2em] group-hover:text-primary transition-all">
                                            Ver Projeto
                                            <ArrowRight className="w-3 h-3 translate-x-0 group-hover/btn:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Accent Bar */}
                                <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500" />
                            </motion.div>
                        )
                    })}
                </div>

                <div className="mt-12 md:hidden">
                    <button
                        onClick={() => navigate('/projetos')}
                        className="w-full flex items-center justify-center gap-3 font-heading font-bold uppercase tracking-widest text-xs h-16 bg-slate-900 text-white rounded-none"
                    >
                        <span>Ver Portfólio Completo</span>
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </section>
    )
}
