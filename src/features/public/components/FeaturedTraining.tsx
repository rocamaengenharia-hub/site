import { Button } from "../../../components/ui/button"

export const FeaturedTraining = () => {
    return (
        <section className="py-20 bg-primary relative overflow-hidden text-white" id="trainings">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">

                <div className="space-y-6 max-w-xl">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-light opacity-90 tracking-widest uppercase">Treinamentos</h3>
                        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                            NR12
                        </h2>
                    </div>

                    <ul className="space-y-2 font-medium text-lg opacity-90">
                        <li className="flex items-center gap-2">• Engenheiros</li>
                        <li className="flex items-center gap-2">• Empresas</li>
                    </ul>

                    <p className="text-white/80 max-w-md leading-relaxed">
                        Capacite sua equipe com nossos treinamentos especializados em segurança de máquinas e equipamentos. Certificação válida e conteúdo atualizado com as normas vigentes.
                    </p>

                    <Button className="bg-white text-primary hover:bg-white/90 font-bold uppercase tracking-wide px-8 py-6 rounded-full mt-4">
                        Saiba Mais
                    </Button>
                </div>

                {/* Image Composition */}
                <div className="relative">
                    <div className="w-80 h-80 md:w-96 md:h-96 bg-black/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <img
                        src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2670&auto=format&fit=crop"
                        alt="Treinamento NR12"
                        className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl border-4 border-white/20 mask-gradient-b"
                        style={{
                            maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                        }}
                    />

                    <div className="absolute -bottom-6 -right-6 bg-white text-primary p-6 rounded-xl shadow-xl z-20 hidden md:block group cursor-pointer hover:scale-105 transition-transform">
                        <span className="block text-xs font-bold uppercase tracking-widest mb-1 text-gray-400">Próxima Turma</span>
                        <span className="block text-2xl font-black">15 FEV</span>
                        <div className="mt-2 text-xs font-bold border-b border-primary/20 pb-1 inline-block text-primary">INSCREVA-SE AGORA</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
