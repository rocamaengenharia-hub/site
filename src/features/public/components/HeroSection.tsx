import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { usePageContent } from '../../site-editor/useSiteContent'
import { useProjects } from '../../projects/useProjects'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useMemo } from 'react'

const HERO_SLIDES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop",
        title: "CASA DA MATA",
        subtitle: "Integração perfeita com a natureza",
        location: "Nova Lima, MG"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2700&auto=format&fit=crop",
        title: "INTERIORES",
        subtitle: "Design e sofisticação em cada detalhe",
        location: "São Paulo, SP"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2700&auto=format&fit=crop",
        title: "OBRAS CIVIS",
        subtitle: "Excelência técnica e pontualidade",
        location: "Belo Horizonte, MG"
    }
]

export const HeroSection = () => {
    const { data: pageData } = usePageContent('home', 'hero')
    const { data: projects } = useProjects()
    const navigate = useNavigate()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [progress, setProgress] = useState(0)

    const slides = useMemo(() => {
        const raw = pageData?.content?.slides
            ? pageData.content.slides.filter((s: any) => s.project_id)
            : HERO_SLIDES

        if (!projects) return raw

        return raw.map((slide: any) => {
            if (slide.project_id) {
                const project = projects.find((p) => p.id === slide.project_id)
                if (project) {
                    const updates: any = {}
                    if (project.location && !slide.location) updates.location = project.location
                    if (project.cover_position) updates.cover_position = project.cover_position
                    if (Object.keys(updates).length > 0) return { ...slide, ...updates }
                }
            }
            return slide
        })
    }, [pageData, projects])

    const nextSlide = useCallback(() => {
        if (slides.length > 0) {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
            setProgress(0)
        }
    }, [slides.length])

    const prevSlide = useCallback(() => {
        if (slides.length > 0) {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
            setProgress(0)
        }
    }, [slides.length])

    // Auto-advance logic with progress bar
    useEffect(() => {
        if (slides.length === 0) return

        const duration = 6000
        const interval = 50
        const steps = duration / interval
        let currentStep = 0

        // Reset progress on slide change manually handled by effect cleanup/init
        // We don't setProgress(0) here to avoid flicker if just the effect re-runs, 
        // but since currentSlide is in deps, it effectively resets.

        const timer = setInterval(() => {
            currentStep++
            setProgress((currentStep / steps) * 100)

            if (currentStep >= steps) {
                nextSlide()
                currentStep = 0
            }
        }, interval)

        return () => {
            clearInterval(timer)
            setProgress(0) // Reset progress when effect cleans up (slide changes)
        }
    }, [currentSlide, slides.length, nextSlide])

    const renderMedia = (slide: any) => {
        const isVideo = slide.type === 'video' || (typeof slide.image === 'string' && slide.image.match(/\.(mp4|webm|ogg)$/i))
        if (isVideo) {
            return <video src={slide.image} autoPlay muted loop playsInline className="w-full h-full object-cover brightness-[0.7]" />
        }
        return <img src={slide.image} alt={slide.title} className="w-full h-full object-cover brightness-[0.7]" style={{ objectPosition: slide.cover_position || 'center' }} />
    }

    if (slides.length === 0) return null

    const activeSlide = slides[currentSlide] || slides[0]

    return (
        <section className="relative h-screen w-full overflow-hidden bg-slate-950">
            {/* Background Carousel */}
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={activeSlide.id || currentSlide}
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 z-0"
                >
                    {renderMedia(activeSlide)}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                </motion.div>
            </AnimatePresence>

            {/* Grid Overlay for Technical Feel */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '64px 64px' }}></div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-6 h-full flex items-start">
                <div className="w-full">
                    <div className="h-40 md:h-56 shrink-0" />
                    <motion.div
                        key={`content-${activeSlide.id || currentSlide}`}
                        className="space-y-6 md:space-y-8"
                    >
                        {/* Subtle Label */}
                        <div className="overflow-hidden">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex items-center gap-3"
                            >
                                <span className="h-px w-8 bg-primary"></span>
                                <span className="text-white/80 font-mono text-xs md:text-sm tracking-[0.2em] uppercase">
                                    {activeSlide.location || "Rocama Engenharia"}
                                </span>
                            </motion.div>
                        </div>

                        {/* Main Title */}
                        <div className="overflow-hidden">
                            <motion.h1
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="text-5xl md:text-8xl lg:text-9xl font-heading font-black text-white uppercase tracking-tighter leading-[0.9] -ml-1 md:-ml-2"
                            >
                                {activeSlide.title}
                            </motion.h1>
                        </div>

                        {/* Subtitle */}
                        <div className="overflow-hidden max-w-xl">
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="text-lg md:text-xl text-white/70 font-light leading-relaxed border-l-2 border-white/20 pl-6"
                            >
                                {activeSlide.subtitle}
                            </motion.p>
                        </div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="pt-8"
                        >
                            <Button
                                className="relative overflow-hidden group bg-transparent hover:bg-transparent border border-white text-white rounded-none px-10 py-6 uppercase tracking-widest text-xs font-bold transition-all hover:border-primary hover:text-primary"
                                onClick={() => {
                                    if (activeSlide.project_id) {
                                        navigate(`/projetos/${activeSlide.project_id}`)
                                    } else {
                                        navigate('/servicos')
                                    }
                                }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Ver Projeto Detalhado
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 w-full z-20 border-t border-white/10 glass-panel">
                <div className="container mx-auto px-6 h-20 md:h-24 flex items-center justify-between">

                    {/* Progress Indicator */}
                    <div className="flex items-center gap-6">
                        <span className="text-white font-mono text-xl md:text-2xl font-bold">
                            0{currentSlide + 1}
                        </span>
                        <div className="h-px w-24 md:w-32 bg-white/20 relative overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-primary"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-white/40 font-mono text-xl md:text-2xl">
                            0{slides.length}
                        </span>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex bg-white/5 border-l border-r border-white/10">
                        <button
                            onClick={prevSlide}
                            className="w-16 h-20 md:w-20 md:h-24 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-colors border-r border-white/10"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-16 h-20 md:w-20 md:h-24 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-colors"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
