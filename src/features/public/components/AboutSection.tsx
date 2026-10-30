import { ArrowRight, CheckCircle2 } from "lucide-react"
import { useSettings } from "../../settings/useSettings"
import { usePageContent } from "../../site-editor/useSiteContent"
import { motion } from "framer-motion"

export const AboutSection = () => {
    const { data: settings } = useSettings()
    const { data: pageData } = usePageContent('home', 'about')

    const c = pageData?.content || {}
    const label = c.label || 'Sobre Nós / Est. 2010'
    const titleLine1 = c.title_line1 || 'Solidez técnica e'
    const titleLine2 = c.title_line2 || 'visão construtiva.'
    const paragraph1 = c.paragraph1 || 'é sinônimo de excelência na construção civil. Não apenas erguemos estruturas, mas materializamos visões com precisão milimétrica.'
    const paragraph2 = c.paragraph2 || 'Nossa abordagem integra engenharia de ponta com gestão eficiente, garantindo que cada projeto residencial, comercial ou industrial seja entregue com rigor técnico e acabamento impecável.'
    const features = c.features || [{ text: 'Gestão Transparente' }, { text: 'Equipe Especializada' }, { text: 'Prazos Garantidos' }, { text: 'Acabamento Premium' }]
    const imageUrl = c.image_url || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2000&auto=format&fit=crop'
    const imageLocation = c.image_location || 'São Paulo, SP'
    const imageArea = c.image_area || '1.250 m²'

    return (
        <section className="py-20 md:py-24 bg-white overflow-hidden relative" id="about">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:w-1/2 space-y-8"
                    >
                        <div className="inline-flex items-center gap-3 border-b border-slate-200 pb-2 mb-2">
                            <div className="w-2 h-2 bg-primary"></div>
                            <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">{label}</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-slate-900 leading-tight">
                            {titleLine1}<br />
                            <span className="text-slate-400">{titleLine2}</span>
                        </h2>

                        <div className="text-slate-600 text-lg font-light leading-relaxed space-y-6 border-l-2 border-slate-100 pl-6">
                            <p>
                                A <strong className="text-slate-900 font-semibold">{settings?.company_name || 'Rocama Engenharia'}</strong> {paragraph1}
                            </p>
                            <p className="text-base">
                                {paragraph2}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            {features.map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-slate-700">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <a href="/sobre-nos" className="group inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-3 hover:bg-primary transition-colors duration-300">
                                <span className="text-xs font-bold uppercase tracking-widest">Conheça Nossa História</span>
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </motion.div>

                    <div className="lg:w-1/2 relative mt-8 lg:mt-0">
                        <div className="relative aspect-[16/9] lg:aspect-[4/3] max-w-lg mx-auto lg:mx-0 lg:ml-auto">
                            <div className="absolute -inset-4 border border-slate-200 z-0 hidden md:block"></div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative z-10 w-full h-full overflow-hidden bg-slate-100 shadow-xl"
                            >
                                <img
                                    src={imageUrl}
                                    alt="Rocama Engenharia Obra"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 border-t border-slate-100 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider">Localização</span>
                                        <span className="text-xs font-bold text-slate-900">{imageLocation}</span>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200"></div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider">Área</span>
                                        <span className="text-xs font-bold text-slate-900">{imageArea}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
