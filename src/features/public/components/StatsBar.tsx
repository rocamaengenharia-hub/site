import { motion, useSpring, useTransform, useInView } from "framer-motion"
import { Award, Building2, Users, CheckCircle2, ArrowUpRight } from "lucide-react"
import { useEffect, useRef, useMemo } from "react"
import { usePageContent } from "../../site-editor/useSiteContent"

const CountingNumber = ({ value }: { value: string }) => {
    const numericValue = parseInt(value.replace(/\D/g, ""))
    const suffix = value.replace(/[0-9]/g, "")
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.5 })

    const spring = useSpring(0, {
        mass: 1,
        stiffness: 50,
        damping: 25, // Smoother damping for a more "heavy machinery" feel
    })

    const displayValue = useTransform(spring, (current) =>
        Math.round(current).toString() + suffix
    )

    useEffect(() => {
        if (isInView) {
            spring.set(numericValue)
        }
    }, [isInView, numericValue, spring])

    return <motion.span ref={ref} className="tabular-nums">{displayValue}</motion.span>
}

const ICONS = [Building2, Award, Users, CheckCircle2]

const DEFAULT_STATS = [
    { value: "15+", label: "Anos de Experiência", sub: "Desde 2010" },
    { value: "120+", label: "Projetos Entregues", sub: "Residenciais e Comerciais" },
    { value: "500+", label: "Clientes Satisfeitos", sub: "Em todo Brasil" },
    { value: "100%", label: "Qualidade Garantida", sub: "Certificação ISO" }
]

export const StatsBar = () => {
    const { data: pageData } = usePageContent('home', 'stats')

    const stats = useMemo(() => {
        const items = pageData?.content?.stats || DEFAULT_STATS
        return items.map((item: any, i: number) => ({
            id: String(i + 1).padStart(2, '0'),
            icon: ICONS[i % ICONS.length],
            value: item.value,
            label: item.label,
            sub: item.sub
        }))
    }, [pageData])

    // Lista salva vazia no editor = esconder a faixa (sem cair nos números de exemplo)
    if (stats.length === 0) return null

    return (
        <section className="bg-primary text-white border-y border-white/10 relative overflow-hidden">
            {/* Texture/Noise overlay if global CSS has it, otherwise subtle grain via CSS gradient */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat: any, index: number) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className={`
                                    relative p-8 md:p-12 group cursor-default
                                    border-b md:border-b-0 lg:border-r border-white/10
                                    last:border-0
                                `}
                            >
                                {/* Hover Effect Background */}
                                <div className="absolute inset-0 bg-black/10 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />

                                <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                                    {/* Header: Icon and ID */}
                                    <div className="flex justify-between items-start opacity-70 group-hover:opacity-100 transition-opacity">
                                        <Icon className="h-6 w-6" strokeWidth={1.5} />
                                        <span className="font-mono text-xs opacity-50"></span>
                                    </div>

                                    {/* Main Value */}
                                    <div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl md:text-6xl font-heading font-black tracking-tighter">
                                                <CountingNumber value={stat.value} />
                                            </span>
                                        </div>

                                        <div className="h-0.5 w-12 bg-white/30 mt-4 mb-4 group-hover:w-full transition-all duration-500" />

                                        <h3 className="font-bold uppercase tracking-widest text-sm mb-1">
                                            {stat.label}
                                        </h3>
                                        <p className="text-white/60 text-xs font-mono">
                                            {stat.sub}
                                        </p>
                                    </div>

                                    {/* Corner Accent */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <ArrowUpRight className="h-3 w-3" />
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
