import { useParams, useNavigate } from 'react-router-dom'
import { useService } from './useService'
import { useProjects } from '../projects/useProjects'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, ShieldCheck, Target, Square, ArrowRight, DraftingCompass } from 'lucide-react'
import { Button } from '../../components/ui/button'

export const PublicServiceDetailsPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { data: service, isLoading: isServiceLoading } = useService(id!)
    const { data: projects } = useProjects()

    // Filter projects related to this service
    const relatedProjects = projects?.filter(p => p.service_id === service?.id) || []

    if (isServiceLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-slate-50">
                <div className="w-16 h-16 bg-slate-900 flex items-center justify-center">
                    <Square className="text-white w-8 h-8" />
                </div>
                <div className="text-center">
                    <h2 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tighter">Módulo não encontrado</h2>
                    <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-widest">Serviço não encontrado</p>
                </div>
                <Button
                    onClick={() => navigate('/servicos')}
                    className="bg-slate-900 text-white rounded-none px-12 h-14 hover:bg-primary uppercase font-bold text-xs tracking-[0.2em] transition-all"
                >
                    Voltar aos Serviços
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-screen overflow-x-hidden">
            {/* Technical Header / Hero */}
            <section className="relative min-h-[85vh] w-full bg-slate-950 overflow-hidden flex items-start pb-32">
                {/* Visual Anchors & Grids */}
                <div className="absolute inset-0 z-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                />
                <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-white/10" />

                <div className="relative z-20 container mx-auto px-6">
                    <div className="h-40 md:h-56 shrink-0" />
                    <div className="max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 mb-10"
                        >
                            <button
                                onClick={() => navigate('/servicos')}
                                className="group flex items-center gap-3 text-slate-400 hover:text-primary transition-colors font-mono text-xs uppercase tracking-[0.3em]"
                            >
                                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
                                Voltar aos Serviços
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-primary font-mono text-sm tracking-[0.4em] uppercase mb-4 block font-bold">
                                Memorial Descritivo
                            </span>
                            <h1 className="text-5xl md:text-8xl lg:text-9xl font-heading font-black text-white uppercase leading-[0.8] tracking-tighter mb-12">
                                {service.title}
                            </h1>

                            <div className="flex flex-wrap gap-8 items-center border-l-2 border-primary pl-8 mt-12">
                                <div>
                                    <span className="block text-xs text-slate-500 font-mono uppercase mb-1">Status de Serviço</span>
                                    <span className="text-white font-bold text-xl uppercase tracking-wider">Operacional</span>
                                </div>
                                <div className="w-px h-12 bg-white/10 hidden md:block" />
                                <div>
                                    <span className="block text-xs text-slate-500 font-mono uppercase mb-1">Certificação Técnica</span>
                                    <span className="text-white font-bold text-xl uppercase tracking-wider">NBR ISO 9001</span>
                                </div>
                                <div className="w-px h-12 bg-white/10 hidden md:block" />
                                <div>
                                    <span className="block text-xs text-slate-500 font-mono uppercase mb-1">Controle de Revisão</span>
                                    <span className="text-white font-bold text-xl uppercase tracking-wider">Atualizado</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Vertical Side Label */}
                <div className="absolute right-0 top-0 bottom-0 w-20 flex flex-col justify-center items-center border-l border-white/10 bg-white/5 backdrop-blur-sm">
                    <span className="text-white/20 font-mono text-xs uppercase tracking-[1em] rotate-90 whitespace-nowrap">Ficha Técnica</span>
                </div>
            </section>

            {/* Detailed Content Grid */}
            <section className="py-24 md:py-32 container mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">

                    {/* Main Technical Specs */}
                    <div className="lg:col-span-8 space-y-20">
                        <div className="relative">
                            {/* Decorative blueprint corner */}
                            <div className="absolute -top-10 -left-10 w-32 h-32 opacity-[0.03] pointer-events-none select-none">
                                <DraftingCompass className="w-full h-full rotate-45" />
                            </div>

                            <div className="flex items-center gap-6 mb-12">
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-900 bg-slate-100 px-4 py-2 border-l-4 border-primary">
                                    01. Descritivo de Execução
                                </h3>
                                <div className="h-px flex-grow bg-slate-100" />
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <p className="text-2xl md:text-3xl font-heading font-black text-slate-900 leading-[1.1] uppercase tracking-tighter mb-12 border-b border-slate-100 pb-12">
                                    {service.short_description || 'Abordagem estratégica focada em rigor técnico e excelência operacional.'}
                                </p>

                                <div className="space-y-8 text-slate-600 text-lg font-light leading-relaxed">
                                    {(service.description ?? '').split('\n').map((para, i) => (
                                        <p key={i} className="first-letter:text-5xl first-letter:font-black first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left">
                                            {para}
                                        </p>
                                    )) || (
                                            <p>Expandimos os limites da engenharia convencional através de processos proprietários desenvolvidos para garantir a integridade estrutural e o acabamento de altíssimo luxo que definem a marca Rocama.</p>
                                        )}
                                </div>
                            </div>
                        </div>

                        {/* Visual Indicators Grid */}
                        <div className="grid md:grid-cols-3 gap-0 border border-slate-200 divide-x divide-slate-200">
                            {[
                                { label: 'Precisão', value: '0.01mm', icon: Target },
                                { label: 'Segurança', value: 'Protocolo-S', icon: ShieldCheck },
                                { label: 'Qualidade', value: 'Rigor-Max', icon: Square }
                            ].map((spec, i) => (
                                <div key={i} className="p-8 group hover:bg-slate-50 transition-colors">
                                    <spec.icon className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors mb-6" strokeWidth={1.5} />
                                    <span className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">{spec.label}</span>
                                    <span className="block text-xl font-black text-slate-900 uppercase tracking-tighter">{spec.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Related Projects Section */}
                        {relatedProjects.length > 0 && (
                            <div className="pt-20">
                                <div className="flex items-center gap-6 mb-12">
                                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-900 bg-slate-100 px-4 py-2 border-l-4 border-primary">
                                        02. Registro de Obras Concluídas
                                    </h3>
                                    <div className="h-px flex-grow bg-slate-100" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {relatedProjects.map((project, idx) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="group relative cursor-pointer border border-slate-200 overflow-hidden"
                                            onClick={() => navigate(`/projetos/${project.id}`)}
                                        >
                                            <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                                                <img
                                                    src={project.main_image || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2700&auto=format&fit=crop"}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-heading font-black text-lg text-slate-900 uppercase tracking-tighter group-hover:text-primary transition-colors">{project.title}</h4>
                                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                                                </div>
                                                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{project.location}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Technical Sidebar */}
                    <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-32">
                        <div className="bg-slate-950 p-10 relative overflow-hidden text-white shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 font-mono text-[60px] font-black text-white/[0.03] leading-none select-none">
                                CTA
                            </div>
                            <h4 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-primary mb-8 underline decoration-primary underline-offset-8 decoration-2">
                                Solicitar Avaliação
                            </h4>
                            <p className="text-xl font-heading font-black uppercase tracking-tighter leading-tight mb-8">
                                Inicie o planejamento técnico do seu projeto agora.
                            </p>
                            <button
                                onClick={() => navigate('/contato')}
                                className="w-full h-16 bg-white text-slate-950 hover:bg-primary hover:text-white transition-all duration-300 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 group"
                            >
                                Falar com Consultor
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </button>

                            <div className="mt-10 pt-10 border-t border-white/10">
                                <span className="block text-xs font-mono text-slate-500 uppercase mb-4 tracking-widest">Procedimentos Operacionais</span>
                                <ul className="space-y-4">
                                    {['Análise de Viabilidade', 'Projeto Estrutural', 'Cálculo de Insumos', 'Cronograma Gantt'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            <div className="w-1.5 h-1.5 bg-primary shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Technical Label (Audit Style) */}
                        <div className="p-8 border border-dashed border-slate-300 rounded-none bg-slate-50/50">
                            <span className="text-xs font-mono text-slate-400 uppercase tracking-tighter leading-relaxed block">
                                TODOS OS PROCEDIMENTOS DESCRITOS NESTE MEMORIAL SEGUEM RIGOROSAMENTE AS NORMAS TÉCNICAS DA ABNT E SÃO AUDITADOS PERIODICAMENTE PARA GARANTIA DE QUALIDADE TOTAL.
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
