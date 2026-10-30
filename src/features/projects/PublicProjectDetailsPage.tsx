import { useParams, useNavigate } from 'react-router-dom'
import { useProject } from './useProjects'
import { useProjectTimeline } from './useProjectTimeline'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, ChevronRight, Play, Target } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { FinalCTASection } from '../public/components/FinalCTASection'

export const PublicProjectDetailsPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { data: project, isLoading: isProjectLoading } = useProject(id!)
    const { data: timeline, isLoading: isTimelineLoading } = useProjectTimeline(id!)

    if (isProjectLoading || isTimelineLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-white">
                <h1 className="text-4xl md:text-6xl font-heading font-black text-slate-900 uppercase tracking-tighter">404 // PROJETO NÃO ENCONTRADO</h1>
                <Button
                    onClick={() => navigate('/projetos')}
                    className="bg-slate-950 text-white rounded-none hover:bg-primary uppercase tracking-widest text-xs h-14 px-10"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Portfólio
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-screen pb-0">
            {/* Hero Image — Full-width cover like SAAG */}
            <header className="relative w-full h-[45vh] md:h-[55vh] overflow-hidden">
                <img
                    src={project.main_image || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2700&auto=format&fit=crop"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: project.cover_position || 'center' }}
                />
            </header>

            {/* Project Content Section */}
            <main className="container mx-auto px-6 py-16 md:py-24">
                <div className="grid lg:grid-cols-12 gap-16">

                    {/* Main Content & Timeline */}
                    <div className="lg:col-span-8 space-y-16">

                        {/* Project Title */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-slate-900 leading-[0.9] uppercase tracking-tighter">
                            {project.title}
                        </h1>

                        {/* Description */}
                        {project.description && (
                        <div className="text-slate-600 text-base leading-relaxed font-light max-w-2xl">
                            {(project.description ?? '').split('\n').map((para, i) => (
                                <p key={i} className="mb-4">{para}</p>
                            ))}
                        </div>
                        )}

                        {/* Projeto da Obra */}
                        {project.show_gallery_project && project.gallery_project && project.gallery_project.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-[2px] bg-primary"></div>
                                    <h2 className="text-2xl font-heading font-black tracking-tighter text-slate-900 uppercase">Projeto da Obra</h2>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {(project.gallery_project ?? []).filter(Boolean).map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="aspect-square relative overflow-hidden group bg-slate-100"
                                        >
                                            <img
                                                src={img}
                                                alt={`Projeto - ${idx + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Processo da Obra */}
                        {project.show_gallery_process && project.gallery_process && project.gallery_process.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-[2px] bg-primary"></div>
                                    <h2 className="text-2xl font-heading font-black tracking-tighter text-slate-900 uppercase">Processo da Obra</h2>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {(project.gallery_process ?? []).filter(Boolean).map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="aspect-square relative overflow-hidden group bg-slate-100"
                                        >
                                            <img
                                                src={img}
                                                alt={`Processo - ${idx + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Construction Log (Timeline) */}
                        {timeline && timeline.length > 0 && (
                            <section className="space-y-16">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-[2px] bg-primary"></div>
                                    <h2 className="text-2xl font-heading font-black tracking-tighter text-slate-900 uppercase">Registro de Execução</h2>
                                </div>

                                <div className="relative border-l-2 border-slate-200 ml-4 md:ml-8 space-y-24 py-8">
                                    {timeline.map((event, index) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative pl-12 md:pl-20"
                                        >
                                            {/* Technical Node */}
                                            <div className="absolute left-[-9px] top-0 w-4 h-4 bg-primary ring-8 ring-white" />

                                            <div className="space-y-8">
                                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                                    <div>
                                                        <span className="text-xs font-mono font-black text-primary tracking-widest uppercase block mb-2">Etapa {index + 1}</span>
                                                        <h3 className="text-3xl font-heading font-black text-slate-900 leading-none uppercase tracking-tight">{event.title}</h3>
                                                    </div>
                                                    <div className="font-mono text-xs text-slate-400 bg-slate-50 px-4 py-1.5 border border-slate-100 uppercase font-bold">
                                                        Concluído
                                                    </div>
                                                </div>

                                                <p className="text-slate-500 font-light leading-relaxed max-w-3xl text-sm normal-case">
                                                    {event.description}
                                                </p>

                                                {/* Colorful Event Media */}
                                                {(event.images?.length || 0) + (event.videos?.length || 0) > 0 && (
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {event.images?.filter(Boolean).map((img, i) => (
                                                            <div key={i} className="group relative aspect-square bg-slate-100 overflow-hidden border border-slate-100">
                                                                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </div>
                                                        ))}
                                                        {event.videos?.filter(Boolean).map((vid, i) => (
                                                            <div key={i} className="aspect-square bg-slate-950 flex items-center justify-center relative group overflow-hidden">
                                                                <Play className="h-8 w-8 text-primary z-10" />
                                                                <video src={vid} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right side: Sidebar metadata */}
                    <aside className="lg:col-span-4 space-y-8">

                        {/* Project Info Card */}
                        <div className="bg-slate-950 p-8 text-white space-y-6">
                            <h4 className="text-2xl font-heading font-black uppercase tracking-tighter leading-none">
                                {project.service?.title || "Ficha Técnica"}
                            </h4>

                            <ul className="space-y-3 text-sm border-t border-white/10 pt-6">
                                {project.location && (
                                    <li><strong className="text-white">Localização</strong>: <span className="text-slate-400">{project.location}</span></li>
                                )}
                                {project.service?.title && (
                                    <li><strong className="text-white">Escopo</strong>: <span className="text-slate-400">{project.service.title}</span></li>
                                )}
                                {project.completion_date && (
                                    <li><strong className="text-white">Conclusão</strong>: <span className="text-slate-400">{new Date(project.completion_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}</span></li>
                                )}
                                <li><strong className="text-white">Status</strong>: <span className="text-slate-400">{project.completion_date ? 'Finalizada e Entregue' : 'Em Andamento'}</span></li>
                            </ul>

                            <Button
                                className="w-full bg-white text-slate-950 rounded-none h-14 font-heading font-black uppercase tracking-widest text-xs hover:bg-primary transition-all group"
                                onClick={() => navigate(`/servicos/${project.service_id}`)}
                            >
                                Ficha do Serviço
                                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                            </Button>
                        </div>

                        {/* CTA Plan */}
                        <div className="border-[3px] border-slate-950 p-12 space-y-10 group">
                            <Target className="w-16 h-16 text-primary" strokeWidth={1} />
                            <h4 className="text-3xl font-heading font-black text-slate-950 uppercase tracking-tighter leading-[0.9]">
                                TRANSFORME SEU PROJETO EM REALIDADE TÉCNICA.
                            </h4>
                            <p className="text-slate-500 text-xs font-light lowercase leading-relaxed">
                                oferecemos consultoria especializada de alto padrão para obras residenciais e comerciais exclusivas.
                            </p>
                            <Button
                                className="w-full bg-slate-950 text-white rounded-none h-16 font-heading font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-slate-950 transition-all"
                                onClick={() => navigate('/contato')}
                            >
                                Iniciar Planejamento
                            </Button>
                        </div>
                    </aside>
                </div>
            </main>

            <FinalCTASection />
        </div>
    )
}
