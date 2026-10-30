import { motion } from "framer-motion"
import { Quote, ShieldCheck } from "lucide-react"
import { useMemo } from "react"
import { usePageContent } from "../../site-editor/useSiteContent"

const DEFAULT_TESTIMONIALS = [
    {
        name: "Ricardo Mendes",
        role: "Empresário",
        project: "Galpão Industrial",
        content: "A precisão técnica e o cumprimento rigoroso dos prazos da Rocama foram fundamentais para a expansão do nosso centro logístico. Profissionais de altíssimo nível.",
    },
    {
        name: "Ana Paula Silveira",
        role: "Arquiteta",
        project: "Residência Alphaville",
        content: "Trabalhar com a Rocama é sinônimo de tranquilidade. Eles entendem a visão do arquiteto e entregam uma execução que respeita cada detalhe do projeto original.",
    },
    {
        name: "Carlos Ferreira",
        role: "Investidor Imobiliário",
        project: "Edifício Horizonte",
        content: "Encontrei na Rocama um parceiro estratégico. A consultoria técnica deles salvou o projeto de grandes problemas estruturais que não haviam sido previstos.",
    }
]

export const TestimonialsSection = () => {
    const { data: pageData } = usePageContent('home', 'testimonials')

    const testimonials = useMemo(() => {
        const items = pageData?.content?.testimonials || DEFAULT_TESTIMONIALS
        return items.map((item: any, i: number) => ({
            id: `LOG_${String(i + 1).padStart(3, '0')}`,
            name: item.name,
            role: item.role,
            project: item.project,
            content: item.content,
            status: "Projeto Concluído + Verificado"
        }))
    }, [pageData])

    return (
        <section className="py-24 md:py-32 bg-white relative overflow-hidden" id="testimonials">
            {/* Technical Background Details */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24">
                    <div className="max-w-2xl">
                        <span className="text-primary font-mono text-xs tracking-[0.2em] uppercase mb-4 block">
                            Depoimentos
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 uppercase leading-[0.9]">
                            RELATÓRIOS DE<br />
                            <span className="text-slate-400">SATISFAÇÃO</span>
                        </h2>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-0 border-t border-l border-slate-200">
                    {testimonials.map((testimonial: any, index: number) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="p-8 md:p-12 border-r border-b border-slate-200 bg-white relative group flex flex-col h-full"
                        >
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                {/* Header: ID & Meta */}
                                <div className="flex justify-between items-center mb-10">
                                    <span className="bg-slate-900 text-white font-mono text-xs px-2 py-1 tracking-wider uppercase">
                                        {testimonial.id}
                                    </span>
                                    <Quote className="h-5 w-5 text-slate-200 group-hover:text-primary/30 transition-colors" opacity={0.5} />
                                </div>

                                {/* Content */}
                                <div className="flex-grow">
                                    <p className="text-slate-600 font-light leading-relaxed mb-10 text-lg">
                                        "{testimonial.content}"
                                    </p>
                                </div>

                                {/* Footer: Client Info */}
                                <div className="pt-8 border-t border-slate-100">
                                    <div className="mb-4 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest">
                                            {testimonial.status}
                                        </span>
                                    </div>

                                    <h4 className="text-xl font-heading font-bold text-slate-900 mb-1">
                                        {testimonial.name}
                                    </h4>
                                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase tracking-wider">
                                        <span>{testimonial.role}</span>
                                        <span className="text-xs border border-slate-200 px-1">{testimonial.project}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Technical Bottom Bar */}
            </div>
        </section>
    )
}
