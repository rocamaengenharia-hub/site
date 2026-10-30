import { motion } from "framer-motion"
import { ArrowUpRight, Loader2, Target } from "lucide-react"
import { useProjects } from "../../projects/useProjects"
import { useNavigate } from "react-router-dom"

export const FeaturedProject = () => {
    const { data: allProjects, isLoading } = useProjects()
    const navigate = useNavigate()

    const projects = allProjects?.filter(p => p.is_featured).slice(0, 3) || allProjects?.slice(0, 3) || []

    if (isLoading) {
        return (
            <div className="py-32 flex justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (projects.length === 0) return null

    return (
        <section className="py-24 md:py-32 bg-white relative overflow-hidden" id="featured">
            {/* Industrial Background Grid */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 px-2">
                    <div className="max-w-2xl">
                        <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase mb-4 block">
                            Destaque
                        </span>
                        <h2 className="text-5xl md:text-8xl font-heading font-black text-slate-900 leading-[0.85] uppercase tracking-tighter">
                            OBRAS EM<br />
                            <span className="text-slate-400">DESTAQUE.</span>
                        </h2>
                    </div>

                    <div className="hidden md:flex flex-col items-end">
                        <button
                            onClick={() => navigate('/projetos')}
                            className="group flex items-center gap-4 font-heading font-bold uppercase tracking-[0.2em] text-sm py-4 px-8 bg-slate-900 text-white hover:bg-primary transition-all duration-500"
                        >
                            <span>EXPLORAR ARQUIVO</span>
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                        </button>
                    </div>
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
                                transition={{ duration: 0.8, delay: idx * 0.15 }}
                                className="group relative bg-white p-10 border-r border-b border-slate-200 overflow-hidden cursor-pointer"
                                onClick={() => navigate(`/projetos/${project.id}`)}
                            >
                                {/* Technical ID Hover Backdrop */}
                                <div className="absolute top-0 right-0 p-4 font-mono text-[80px] font-black text-slate-50 leading-none select-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
                                    {number}
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    {/* Image Container with Label */}
                                    <div className="relative aspect-[16/10] mb-12 overflow-hidden bg-slate-100">
                                        <img
                                            src={project.main_image || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2700&auto=format&fit=crop"}
                                            alt={project.title}
                                            className="w-full h-full object-cover grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-[0.16,1,0.3,1]"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-primary text-slate-950 font-mono text-xs px-3 py-1 font-black uppercase tracking-tighter shadow-lg">
                                                {project.service?.title || "Destaque"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-[0.2em]">
                                            <Target className="w-3.5 h-3.5" strokeWidth={2} />
                                            <span>{project.location || "Brasil"}</span>
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <h3 className="text-3xl font-heading font-black text-slate-900 mb-6 group-hover:text-primary transition-colors duration-300 uppercase leading-[0.9] tracking-tighter">
                                            {project.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-light leading-relaxed mb-8 line-clamp-3 italic">
                                            {project.description || 'Descrição em breve.'}
                                        </p>
                                    </div>

                                    <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Status do Projeto</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                                <span className="text-xs font-black font-mono text-slate-900 uppercase tracking-widest">Destaque</span>
                                            </div>
                                        </div>
                                        <div className="group/btn flex items-center gap-2 text-slate-900 font-black text-sm uppercase tracking-[0.2em] group-hover:text-primary transition-all">
                                            DETALHES
                                            <ArrowUpRight className="h-4 w-4 translate-x-0 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Interaction: Dimension Lines (Inside) */}
                                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left z-40" />
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
