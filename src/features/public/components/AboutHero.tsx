import { motion } from "framer-motion"
import { usePageContent } from "../../site-editor/useSiteContent"

export const AboutHero = () => {
    const { data: pageData } = usePageContent('about', 'hero')

    const c = pageData?.content || {}
    const label = c.label || 'Memorial Descritivo'
    const titleLine1 = c.title_line1 || 'QUEM SOMOS'
    const titleLine2 = c.title_line2 || 'NÓS.'
    const foundedYear = c.founded_year || '2010'
    const specialty = c.specialty || 'Engenharia Pesada'
    const location = c.location || 'Brasil / MG & SP'

    return (
        <section className="relative min-h-[85vh] w-full bg-slate-950 flex items-start overflow-hidden pb-32">
            {/* Blueprint Grid Background */}
            <div className="absolute inset-0 z-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="container mx-auto px-6 relative z-10">
                <div className="h-40 md:h-56 shrink-0" />
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-4 mb-8"
                    >
                        <span className="w-12 h-px bg-primary" />
                        <span className="text-primary font-mono text-sm tracking-[0.3em] uppercase">
                            {label}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-white leading-[0.85] uppercase tracking-tighter"
                    >
                        {titleLine1}<br />
                        <span className="text-slate-500">{titleLine2}</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="mt-12 flex flex-col md:flex-row gap-8 md:gap-20 border-l border-white/20 pl-8"
                    >
                        <div>
                            <span className="text-slate-500 font-mono text-xs uppercase block mb-1">Fundada em</span>
                            <span className="text-white font-bold text-xl">{foundedYear}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 font-mono text-xs uppercase block mb-1">Especialidade</span>
                            <span className="text-white font-bold text-xl">{specialty}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 font-mono text-xs uppercase block mb-1">Localização</span>
                            <span className="text-white font-bold text-xl">{location}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Side Element */}
            <div className="absolute right-0 top-0 bottom-0 w-20 flex flex-col justify-center items-center border-l border-white/10 bg-white/5 backdrop-blur-sm">
                <span className="text-white/20 font-mono text-xs uppercase tracking-[1em] rotate-90 whitespace-nowrap">Rocama Engenharia</span>
            </div>
        </section>
    )
}
