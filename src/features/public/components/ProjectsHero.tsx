import { motion } from "framer-motion"
import { usePageContent } from "../../site-editor/useSiteContent"

export const ProjectsHero = () => {
    const { data: pageData } = usePageContent('portfolio', 'hero')

    const label = pageData?.content?.label || 'Nossas Obras'
    const titleLine1 = pageData?.content?.title_line1 || 'PORTFÓLIO DE'
    const titleLine2 = pageData?.content?.title_line2 || 'PROJETOS.'

    return (
        <section className="relative min-h-[60vh] w-full bg-slate-950 flex items-start overflow-hidden pb-20">
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
                        className="flex items-center gap-4 mb-6"
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
                        className="text-6xl md:text-8xl font-heading font-black text-white leading-[0.85] uppercase tracking-tighter"
                    >
                        {titleLine1}<br />
                        <span className="text-slate-500 italic">{titleLine2}</span>
                    </motion.h1>
                </div>
            </div>

            {/* Decorative Side Element */}
            <div className="absolute right-0 top-0 bottom-0 w-1/4 flex flex-col justify-center items-end opacity-5 select-none pointer-events-none pr-10">
                <span className="text-[20vh] font-black text-white leading-none rotate-90 origin-right"></span>
            </div>
        </section>
    )
}
