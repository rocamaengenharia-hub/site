import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { DraftingCompass, Hammer, ClipboardCheck, ArrowRight, Loader2, Package, Layers, PenTool, ShieldCheck } from "lucide-react"
import { useServices } from "../../services/useServices"

export const ServicesCatalog = () => {
    const { data: services, isLoading } = useServices()
    const navigate = useNavigate()

    const getIcon = (title: string) => {
        const t = title.toLowerCase()
        if (t.includes('projeto')) return DraftingCompass
        if (t.includes('reforma') || t.includes('construção')) return Hammer
        if (t.includes('avaliação') || t.includes('perícia')) return ClipboardCheck
        if (t.includes('gestão')) return Layers
        if (t.includes('consultoria')) return PenTool
        return Package
    }

    if (isLoading) {
        return (
            <div className="py-24 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        )
    }

    if (!services || services.length === 0) return null

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-slate-200">
                    {services.filter(s => s.is_active).map((service, index) => {
                        const Icon = getIcon(service.title)
                        const number = (index + 1).toString().padStart(2, '0')

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group relative bg-white p-12 border-r border-b border-slate-200 overflow-hidden cursor-pointer min-h-[450px] flex flex-col"
                                onClick={() => navigate(`/servicos/${service.id}`)}
                            >
                                {/* Technical ID Hover Backdrop */}
                                <div className="absolute top-0 right-0 p-4 font-mono text-[100px] font-black text-slate-50 leading-none select-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
                                    {number}
                                </div>

                                <div className="relative z-10 flex flex-col h-full flex-grow">
                                    <div className="flex justify-between items-start mb-12">
                                        <div className="w-14 h-14 bg-slate-950 text-white flex items-center justify-center p-3.5 group-hover:bg-primary transition-colors duration-300">
                                            <Icon strokeWidth={1.2} className="w-full h-full" />
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <h3 className="text-3xl font-heading font-black text-slate-900 mb-6 group-hover:text-primary transition-colors duration-300 uppercase leading-[0.9]">
                                            {service.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-light leading-relaxed mb-8 line-clamp-4">
                                            {service.short_description || service.description?.slice(0, 160) || 'Descrição em breve.'}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-slate-300" />
                                            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Controle de Qualidade Rocama</span>
                                        </div>
                                        <div className="group/btn flex items-center gap-2 text-slate-950 font-black text-sm uppercase tracking-[0.3em] group-hover:text-primary transition-all">
                                            Abrir Memorial
                                            <ArrowRight className="w-4 h-4 translate-x-0 group-hover/btn:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Accent Bar */}
                                <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-primary group-hover:w-full transition-all duration-700 ease-[0.16,1,0.3,1]" />
                            </motion.div>
                        )
                    })}
                </div>

                {/* Technical Bottom Label */}
            </div>
        </section>
    )
}
