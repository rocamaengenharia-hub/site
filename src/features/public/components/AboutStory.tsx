import { motion } from "framer-motion"
import { usePageContent } from "../../site-editor/useSiteContent"

export const AboutStory = () => {
    const { data: pageData } = usePageContent('about', 'story')

    const c = pageData?.content || {}
    const titleLine1 = c.title_line1 || 'UMA TRAJETÓRIA DE'
    const titleLine2 = c.title_line2 || 'ENGENHARIA PURA.'
    const paragraph1 = c.paragraph1 || 'Fundada em 2010, a Rocama Engenharia nasceu com um propósito claro: elevar o padrão construtivo através de rigor técnico impecável e transparência absoluta. O que começou como um escritório especializado em consultoria estrutural, rapidamente evoluiu para uma construtora de ciclo completo.'
    const paragraph2 = c.paragraph2 || 'Ao longo de mais de uma década, consolidamos nossa presença nos mercados de Minas Gerais e São Paulo, executando desde residências de altíssimo luxo até complexos industriais de alta complexidade. Nossa história não é medida em anos, mas em toneladas de concreto vertidas com precisão e projetos entregues antes do cronograma previsto.'
    const quote = c.quote || 'Para nós, engenharia não é sobre erguer paredes, é sobre gerenciar a complexidade com simplicidade e maestria.'
    const milestones = c.milestones || [
        { year: '2010', text: 'Fundação em Nova Lima / MG' },
        { year: '2015', text: 'Expansão para Obras Industriais' },
        { year: '2021', text: 'Sede Principal em São Paulo' }
    ]

    return (
        <section className="py-24 md:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-start">

                    {/* Visual Marker Side */}
                    <div className="hidden lg:block lg:w-1/3">
                        <div className="sticky top-32">
                            <div className="relative h-[400px] w-full border-r border-slate-200">
                                {/* Technical Scale Markers */}
                                {[...Array(10)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute right-0 flex items-center"
                                        style={{ top: `${(i * 10)}%` }}
                                    >
                                        <span className="text-xs font-mono text-slate-300 mr-4">{i + 1}</span>
                                        <div className="w-8 h-px bg-slate-200" />
                                    </div>
                                ))}

                                <motion.div
                                    className="absolute right-[-2px] w-1 bg-primary"
                                    initial={{ height: 0 }}
                                    whileInView={{ height: '70%' }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                />

                                <div className="absolute right-[-12px] top-[70%] bg-slate-900 text-white text-xs font-mono px-2 py-1 rotate-90 origin-left whitespace-nowrap">
                                    Desde 2010
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="lg:w-2/3 space-y-12">
                        <div className="max-w-2xl">
                            <span className="text-primary font-mono text-xs tracking-[0.2em] uppercase mb-4 block">
                                Linha do Tempo
                            </span>
                            <h2 className="text-4xl md:text-6xl font-heading font-black text-slate-900 leading-[0.9] uppercase mb-10">
                                {titleLine1}<br />
                                <span className="text-slate-400">{titleLine2}</span>
                            </h2>

                            <div className="space-y-8 text-slate-600 text-lg font-light leading-relaxed">
                                <p>{paragraph1}</p>
                                <p>{paragraph2}</p>
                                <p className="text-xl text-slate-900 font-bold border-l-4 border-primary pl-6 py-2">
                                    "{quote}"
                                </p>
                            </div>
                        </div>

                        {/* Milestones Mini Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8">
                            {milestones.map((m: any, i: number) => (
                                <div key={i}>
                                    <span className="text-primary font-mono text-xs block mb-2">{m.year}</span>
                                    <h4 className="text-slate-900 font-bold text-sm uppercase leading-tight">{m.text}</h4>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
