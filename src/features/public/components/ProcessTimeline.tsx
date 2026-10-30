import { motion } from 'framer-motion'
import { CalendarCheck, HardHat, Key, PencilRuler, Cog } from 'lucide-react'
import { useMemo } from 'react'
import { usePageContent } from '../../site-editor/useSiteContent'

const ICONS = [PencilRuler, CalendarCheck, HardHat, Key]
const SPECS = ['Início', 'Planejamento', 'Execução', 'Entrega']

const DEFAULT_STEPS = [
    { title: "BRIEFING & CONCEPÇÃO", description: "Entendemos sua necessidade e transformamos ideias em conceitos tangíveis. Alinhamento de expectativas e viabilidade financeira." },
    { title: "PLANEJAMENTO TÉCNICO", description: "Desenvolvimento de projetos executivos, cronogramas e aprovações legais. Detalhamento completo da engenharia." },
    { title: "EXECUÇÃO DA OBRA", description: "Gestão rigorosa de qualidade, prazos e materiais. Monitoramento em tempo real com relatórios de evolução." },
    { title: "ENTREGA E AUDITORIA", description: "Vistoria técnica final, limpeza pós-obra e entrega das chaves. Excelência atestada pelos nossos engenheiros." }
]

export const ProcessTimeline = () => {
    const { data: pageData } = usePageContent('home', 'process')

    const steps = useMemo(() => {
        const items = pageData?.content?.steps || DEFAULT_STEPS
        return items.map((item: any, i: number) => ({
            id: String(i + 1).padStart(2, '0'),
            title: item.title,
            description: item.description,
            icon: ICONS[i % ICONS.length],
            spec: SPECS[i % SPECS.length]
        }))
    }, [pageData])
    return (
        <section className="py-24 md:py-32 bg-slate-950 text-white relative overflow-hidden" id="process">
            {/* Blueprint Grid Background */}
            <div className="absolute inset-0 z-0 opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(#ffffff0a 1px, transparent 1px), linear-gradient(90deg, #ffffff0a 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 lg:mb-32">
                    <div className="max-w-2xl">
                        <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase mb-4 block">
                            // Ciclo de Operação
                        </span>
                        <h2 className="text-5xl md:text-7xl font-heading font-black text-white leading-[0.85] uppercase tracking-tighter">
                            PROCESSO<br />
                            <span className="text-slate-500">EXECUTIVO.</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/10">
                    {steps.map((step: any, index: number) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="relative group p-10 md:p-12 border-r border-b border-white/10 last:border-r-0 lg:border-b-0 hover:bg-white/[0.02] transition-colors overflow-hidden"
                        >
                            {/* Technical Corner Accent */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/30" />

                            {/* Step Indicator Header */}
                            <div className="mb-12 flex justify-between items-center text-slate-500 font-mono text-xs tracking-widest">
                                <span className="text-primary font-bold">Etapa {step.id}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-px bg-white/10" />
                                    <span>{step.spec}</span>
                                </div>
                            </div>

                            {/* Icon & ID */}
                            <div className="flex items-end gap-4 mb-10">
                                <div className="w-16 h-16 bg-slate-900 border border-white/10 flex items-center justify-center relative shadow-2xl">
                                    <step.icon className="w-7 h-7 text-white group-hover:text-primary transition-colors duration-500" strokeWidth={1} />
                                    <div className="absolute -bottom-2 -right-2 bg-primary text-slate-950 font-mono font-black text-xs px-1.5 py-0.5">
                                        {step.id}
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-heading font-bold text-white mb-6 leading-tight uppercase group-hover:text-primary transition-colors">
                                {step.title}
                            </h3>

                            <p className="text-slate-400 font-light leading-relaxed mb-10 text-sm">
                                {step.description}
                            </p>

                            {/* Footer: Progress/Audit info */}
                            <div className="pt-8 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-mono uppercase tracking-tighter">Progresso</span>
                                    <span className="text-xs font-mono text-primary">100%</span>
                                </div>
                                <div className="w-full h-[2px] bg-white/10">
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '100%' }}
                                        transition={{ duration: 1.5, delay: index * 0.3 }}
                                    />
                                </div>
                            </div>

                            {/* Decorative Background Texture */}
                            <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                <Cog className="w-32 h-32 animate-spin-slow rotate-45" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Audit Bottom Row */}
                <div className="mt-16 flex flex-wrap items-center justify-between gap-8 py-8 border-t border-white/5 opacity-30">
                    <div className="flex items-center gap-10">
                        <div className="flex flex-col">
                            <span className="text-xs font-mono uppercase mb-1">Padrão</span>
                            <span className="text-xs font-bold text-white">ISO 21500:2021</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
