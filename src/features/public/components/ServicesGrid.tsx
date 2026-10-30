import { useNavigate } from "react-router-dom"
import { DraftingCompass, Hammer, ClipboardCheck, ArrowRight, Loader2, Package, Layers, ShieldCheck, PenTool } from "lucide-react"
import { motion } from "framer-motion"
import { useServices } from "../../services/useServices"

export const ServicesGrid = () => {
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
        <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden" id="services">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-2">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 border-b border-slate-200 pb-2 mb-2">
                            <div className="w-2 h-2 bg-primary"></div>
                            <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">Nossas Especialidades // 03</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 leading-[0.9] uppercase tracking-tighter">
                            SERVIÇOS<br />
                            <span className="text-slate-400 italic">ESPECIFICADOS.</span>
                        </h2>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-slate-200">
                    {services.filter(s => s.is_active).map((service, index) => {
                        const Icon = getIcon(service.title)
                        const number = (index + 1).toString().padStart(2, '0')

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group relative bg-white p-10 border-r border-b border-slate-200 overflow-hidden cursor-pointer"
                                onClick={() => navigate(`/servicos/${service.id}`)}
                            >
                                {/* Technical ID Hover Backdrop */}
                                <div className="absolute top-0 right-0 p-4 font-mono text-[80px] font-black text-slate-50 leading-none select-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
                                    {number}
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-12">
                                        <div className="w-12 h-12 bg-slate-950 text-white flex items-center justify-center p-3 group-hover:bg-primary transition-colors duration-300">
                                            <Icon strokeWidth={1.5} className="w-full h-full" />
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <h3 className="text-2xl font-heading font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors duration-300 uppercase leading-snug">
                                            {service.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-light leading-relaxed mb-8 line-clamp-3">
                                            {service.short_description || service.description?.slice(0, 120) || 'Descrição em breve.'}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3 text-slate-300" />
                                            <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">Norma ISO-9001</span>
                                        </div>
                                        <div className="group/btn flex items-center gap-2 text-slate-900 font-bold text-sm uppercase tracking-[0.2em] group-hover:text-primary transition-all">
                                            Detalhes
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

                {/* Bottom Technical Footer */}
                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 px-2 opacity-30">
                    <div className="flex items-center gap-6">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-1 bg-slate-400" />)}
                        </div>
                    </div>
                    <span className="text-xs font-mono tracking-tighter uppercase underline decoration-primary decoration-2 underline-offset-4">
                        Toda execução segue as normas vigentes da ABNT.
                    </span>
                </div>
            </div>
        </section>
    )
}
