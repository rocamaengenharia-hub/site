import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, MessageSquare, Target, ShieldCheck, Zap } from "lucide-react"
import { usePageContent } from "../../site-editor/useSiteContent"

export const FinalCTASection = () => {
    const navigate = useNavigate()
    const { data: pageData } = usePageContent('home', 'cta')

    const c = pageData?.content || {}
    const titleLine1 = c.title_line1 || 'VAMOS ESPECIFICAR SEU'
    const titleLine2 = c.title_line2 || 'PRÓXIMO PROJETO?'
    const description = c.description || 'Da fundação ao acabamento, entregamos precisão técnica e gestão inteligente para obras de qualquer complexidade.'
    // Fallback: update this placeholder once the real WhatsApp number is configured in the CMS (home > cta > whatsapp_number)
    const whatsappNumber = c.whatsapp_number || '5531999999999'
    const buttonPrimaryText = c.button_primary_text || 'Solicitar Consultoria Técnica'
    const buttonSecondaryText = c.button_secondary_text || 'Falar no WhatsApp'

    return (
        <section className="py-24 md:py-40 bg-slate-950 relative overflow-hidden" id="final-cta">
            {/* Blueprint Grid Background - Extremely subtle */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '80px 80px'
                }}
            />

            {/* Massive Background Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-white/[0.02] select-none pointer-events-none leading-none whitespace-nowrap">
                ROCAMA
            </div>

            {/* Industrial corner accents */}
            <div className="absolute top-12 left-12 w-16 h-16 border-t-2 border-l-2 border-primary/30" />
            <div className="absolute bottom-12 right-12 w-16 h-16 border-b-2 border-r-2 border-primary/30" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-12 text-center mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-3 font-mono text-xs text-primary tracking-[0.4em] uppercase mb-8"
                            >
                                <span className="w-8 h-px bg-primary" />
                                Pronto para começar?
                                <span className="w-8 h-px bg-primary" />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-8xl font-heading font-black text-white leading-[0.85] uppercase tracking-tighter mb-10"
                            >
                                {titleLine1} <br />
                                <span className="text-primary">{titleLine2}</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-slate-400 text-lg md:text-xl font-light mb-16 max-w-2xl mx-auto leading-relaxed"
                            >
                                {description}
                            </motion.p>
                        </div>

                        {/* Conversion Area */}
                        <div className="lg:col-span-12">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/contato')}
                                    className="group relative h-20 px-12 bg-primary text-slate-950 font-heading font-black uppercase tracking-widest text-sm overflow-hidden flex items-center justify-center gap-4 transition-all hover:shadow-[0_0_40px_rgba(239,68,68,0.3)] w-full md:w-auto"
                                >
                                    <span>{buttonPrimaryText}</span>
                                    <div className="p-1 bg-slate-950/10 rounded-full group-hover:bg-slate-950/20 transition-colors">
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </div>
                                    {/* Dimension line deco */}
                                    <div className="absolute top-0 left-0 w-2 h-[1px] bg-slate-950/30" />
                                    <div className="absolute top-0 left-0 w-[1px] h-2 bg-slate-950/30" />
                                </motion.button>

                                <motion.a
                                    href={`https://wa.me/${whatsappNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                    className="h-20 px-12 border border-white/20 text-white font-heading font-black uppercase tracking-widest text-sm flex items-center justify-center gap-4 transition-all w-full md:w-auto group"
                                >
                                    <MessageSquare className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                    {buttonSecondaryText}
                                </motion.a>
                            </div>
                        </div>

                        {/* Technical Trust Indicators */}
                        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 border-t border-white/5 pt-12">
                            {[
                                { icon: Target, label: "PRECISÃO MILIMÉTRICA", sub: "Tolerância zero a erros estruturais" },
                                { icon: ShieldCheck, label: "ENGENHARIA NORMATIZADA", sub: "Conformidade total com NBR e ISO" },
                                { icon: Zap, label: "EFICIÊNCIA OPERACIONAL", sub: "Redução de custos e prazos otimizados" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center space-y-3 opacity-60 hover:opacity-100 transition-opacity">
                                    <item.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                                    <div>
                                        <div className="text-xs font-mono font-bold text-white tracking-widest uppercase mb-1">{item.label}</div>
                                        <div className="text-xs font-mono text-slate-500 uppercase">{item.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scanning Laser Line Animation Effect */}
            <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-px bg-primary/20 z-0 pointer-events-none"
            />
        </section>
    )
}
