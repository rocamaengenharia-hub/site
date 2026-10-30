import { motion } from "framer-motion"
import { Target, Zap, Shield } from "lucide-react"
import { useMemo } from "react"
import { usePageContent } from "../../site-editor/useSiteContent"

const ICONS = [Shield, Target, Zap]

const DEFAULT_VALUES = [
    { title: "INTEGRIDADE ESTRUTURAL", description: "Nossa conduta ética é a fundação de cada projeto. Transparência absoluta em orçamentos, materiais e processos executivos." },
    { title: "PRECISÃO TÉCNICA", description: "Engenharia de detalhe. Minimizar margens de erro através de planejamento rigoroso e tecnologia de ponta em todas as fases." },
    { title: "COMPROMISSO DE ENTREGA", description: "Cronogramas não são sugestões, são contratos. Garantimos pontualidade através de uma gestão de obra disciplinada." }
]

export const TechnicalPhilosophy = () => {
    const { data: pageData } = usePageContent('about', 'philosophy')

    const values = useMemo(() => {
        const items = pageData?.content?.values || DEFAULT_VALUES
        return items.map((item: any, i: number) => ({
            id: `SPEC_${String(i + 1).padStart(2, '0')}`,
            title: item.title,
            description: item.description,
            icon: ICONS[i % ICONS.length]
        }))
    }, [pageData])

    return (
        <section className="py-24 md:py-32 bg-slate-950 text-white relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                    <div className="max-w-2xl">
                        <span className="text-primary font-mono text-xs tracking-[0.2em] uppercase mb-4 block">
                            Valores e Conduta
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading font-black text-white leading-none">
                            FILOSOFIA<br />TÉCNICA
                        </h2>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-0 border border-white/10">
                    {values.map((value: any, index: number) => (
                        <motion.div
                            key={value.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                            className="p-10 md:p-14 border-r border-b border-white/10 last:border-r-0 hover:bg-white/[0.02] transition-colors group"
                        >
                            <div className="mb-10 flex justify-between items-start">
                                <span className="text-slate-500 font-mono text-xs">{value.id}</span>
                                <value.icon className="w-8 h-8 text-white group-hover:text-primary transition-colors" strokeWidth={1} />
                            </div>
                            <h3 className="text-2xl font-heading font-bold mb-6">{value.title}</h3>
                            <p className="text-slate-400 font-light leading-relaxed">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
