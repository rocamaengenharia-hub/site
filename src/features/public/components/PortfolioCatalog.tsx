import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Loader2, Target, Plus } from "lucide-react"
import { useProjects } from "../../projects/useProjects"
import { useServices } from "../../services/useServices"
import { useNavigate } from "react-router-dom"

export const PortfolioCatalog = () => {
    const { data: projects, isLoading: projectsLoading } = useProjects()
    const { data: services, isLoading: servicesLoading } = useServices()
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const navigate = useNavigate()

    const isLoading = projectsLoading || servicesLoading

    const filteredProjects = projects?.filter(project =>
        selectedCategory === "all" || project.service_id === selectedCategory
    ) || []

    if (isLoading) {
        return (
            <div className="py-32 flex justify-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-6">
                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-4 mb-16 border-b border-slate-200 pb-8">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-6 py-2 font-mono text-xs uppercase tracking-widest transition-all duration-300 ${selectedCategory === "all"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                            }`}
                    >
                        Todos
                    </button>
                    {services?.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => setSelectedCategory(service.id)}
                            className={`px-6 py-2 font-mono text-xs uppercase tracking-widest transition-all duration-300 ${selectedCategory === service.id
                                ? "bg-slate-900 text-white"
                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                }`}
                        >
                            {service.title}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, idx) => (
                            <motion.div
                                layout
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                className="group relative aspect-[4/5] cursor-pointer overflow-hidden bg-slate-900 rounded-lg shadow-sm hover:shadow-xl transition-all duration-500"
                                onClick={() => navigate(`/projetos/${project.id}`)}
                            >
                                <img
                                    src={project.main_image || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2700&auto=format&fit=crop"}
                                    alt={project.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-110"
                                />

                                {/* Interactive Overlay */}
                                <div className="absolute inset-0 z-20 pointer-events-none p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between bg-gradient-to-t from-slate-950/80 via-transparent to-transparent">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col font-mono text-xs text-primary">
                                            <span>{project.location || "Brasil"}</span>
                                        </div>
                                        <Target className="w-5 h-5 text-primary" strokeWidth={1} />
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="w-12 h-12 bg-primary flex items-center justify-center">
                                            <Plus className="w-6 h-6 text-slate-950" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Label */}
                                <div className="absolute bottom-0 left-0 w-full p-8 z-30">
                                    <div className="flex flex-col gap-2 transform transition-all duration-500 group-hover:translate-y-[-10px]">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-primary text-slate-950 font-mono text-xs px-2 py-0.5 font-black uppercase">
                                                {project.service?.title || "PROJETO"}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-heading font-black text-white leading-none uppercase tracking-tighter">
                                            {project.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-widest mt-2 overflow-hidden">
                                            <MapPin className="h-3 w-3 text-primary shrink-0" />
                                            <span className="truncate">{project.location || "Local não informado"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Border Link */}
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left z-40" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredProjects.length === 0 && (
                    <div className="py-32 text-center border border-slate-200">
                        <span className="font-mono text-slate-400 uppercase tracking-widest text-sm">
                            Nenhum projeto encontrado nesta categoria
                        </span>
                    </div>
                )}
            </div>
        </section>
    )
}
