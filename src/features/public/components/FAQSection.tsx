import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, ArrowUpRight } from "lucide-react"
import { useState, useMemo } from "react"
import { usePageContent } from "../../site-editor/useSiteContent"

const DEFAULT_FAQS = [
    {
        question: "Quais tipos de obras a Rocama realiza?",
        answer: "Realizamos obras residenciais de alto padrão, retrofits (reformas completas), construções comerciais e galpões industriais. Nossa expertise cobre desde a fundação até o acabamento final, sempre focando em excelência técnica e durabilidade."
    },
    {
        question: "Como funciona o acompanhamento técnico?",
        answer: "Oferecemos acompanhamento técnico integral em todas as etapas. Nossos engenheiros realizam visitas periódicas e fornecemos relatórios detalhados de progresso (timeline) via sistema, para que o cliente tenha total transparência e controle."
    },
    {
        question: "A Rocama auxilia no licenciamento?",
        answer: "Sim. Prestamos consultoria completa para regularização de projetos, obtenção de alvarás e licenciamento junto aos órgãos competentes. Garantimos que sua obra esteja 100% legalizada e dentro das normas vigentes."
    },
    {
        question: "Qual o prazo médio de entrega?",
        answer: "O prazo varia conforme a complexidade e escala da obra. Durante a fase de planejamento, entregamos um cronograma detalhado (Gantt) com todas as metas de entrega estabelecidas em contrato, com rigoroso compromisso de pontualidade."
    }
]

export const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0)
    const { data: pageData } = usePageContent('home', 'faq')

    const faqs = useMemo(() => {
        const items = pageData?.content?.faqs || DEFAULT_FAQS
        return items.map((item: any, i: number) => ({
            id: String(i + 1).padStart(2, '0'),
            question: item.question,
            answer: item.answer
        }))
    }, [pageData])

    return (
        <section className="py-24 md:py-32 bg-slate-950 text-white relative overflow-hidden" id="faq">
            {/* Technical Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full border-l border-white/5 hidden lg:block" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-white/10" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Header Area */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32">
                            <span className="text-primary font-mono text-xs tracking-[0.2em] uppercase mb-6 block">
                                Perguntas Frequentes
                            </span>
                            <h2 className="text-5xl md:text-6xl font-heading font-black text-white leading-none mb-8">
                                DÚVIDAS<br />TÉCNICAS
                            </h2>
                            <p className="text-slate-400 font-light leading-relaxed mb-12 max-w-sm">
                                Respostas diretas para as questões mais comuns sobre nossos processos construtivos e gerenciamento.
                            </p>

                            <a href="/contato" className="hidden lg:inline-flex items-center gap-3 group border border-white/20 px-8 py-4 hover:bg-white hover:text-black transition-all duration-300">
                                <span className="text-xs font-bold uppercase tracking-widest">Falar com Consultor</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* FAQ Items */}
                    <div className="lg:col-span-8">
                        <div className="space-y-0 border-t border-white/10">
                            {faqs.map((faq: any, index: number) => (
                                <div key={index} className="border-b border-white/10">
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full flex items-start justify-between py-10 text-left group transition-colors hover:bg-white/[0.02]"
                                    >
                                        <div className="flex gap-6 md:gap-10">
                                            <span className="font-mono text-xs text-primary pt-1.5 opacity-70">
                                                / {faq.id}
                                            </span>
                                            <span className={`text-xl md:text-2xl font-bold font-heading transition-colors duration-300 ${openIndex === index ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                                {faq.question}
                                            </span>
                                        </div>

                                        <div className={`mt-1 p-2 border border-white/20 transition-all duration-300 ${openIndex === index ? 'bg-primary border-primary rotate-90' : 'group-hover:border-white'}`}>
                                            {openIndex === index ? (
                                                <Minus className="h-4 w-4 text-white" />
                                            ) : (
                                                <Plus className="h-4 w-4 text-white" />
                                            )}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-12 md:pl-20 pr-6 pb-10">
                                                    <p className="text-slate-400 font-light leading-relaxed max-w-2xl text-lg">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 lg:hidden">
                            <a href="/contato" className="inline-flex w-full justify-center items-center gap-3 border border-white/20 px-8 py-4 hover:bg-white hover:text-black transition-all duration-300">
                                <span className="text-xs font-bold uppercase tracking-widest">Falar com Consultor</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
