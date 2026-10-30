import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { usePageContent } from "../../site-editor/useSiteContent"

const contactSchema = z.object({
    name: z.string().min(2, "Nome muito curto"),
    email: z.string().email("Email inválido"),
    interest: z.string().optional(),
    details: z.string().min(10, "Por favor, dê mais detalhes"),
})

type ContactFormData = z.infer<typeof contactSchema>

const DEFAULT_OPTIONS = [
    { value: 'nr12', label: 'Adequação NR12' },
    { value: 'laudos', label: 'Laudos e Inspeções' },
    { value: 'treinamento', label: 'Treinamentos' },
    { value: 'outro', label: 'Outros Assuntos' }
]

export const ContactSection = () => {
    const { data: pageData } = usePageContent('contact', 'main')
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema)
    })

    const ct = pageData?.content || {}
    const titleLine1 = ct.title_line1 || 'Estamos Prontos'
    const titleLine2 = ct.title_line2 || 'Para Atendê-lo'
    const description = ct.description || 'Entre em contato conosco para solicitar um orçamento, tirar dúvidas ou agendar uma visita técnica. Nossa equipe retornará o mais breve possível.'
    const bgImage = ct.background_image || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2670&auto=format&fit=crop'
    const interestOptions = ct.interest_options || DEFAULT_OPTIONS

    const onSubmit = async (data: ContactFormData) => {
        // Needs backend integration later (Supabase Edge Function or Email service)
        console.log("Form Data:", data)
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate network
        alert("Mensagem enviada! Entraremos em contato em breve.")
    }

    return (
        <section className="relative py-24 bg-cover bg-center bg-fixed" id="contact" style={{ backgroundImage: `url('${bgImage}')` }}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>

            <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-16 items-center">

                {/* Left Text */}
                <div className="text-white space-y-6">
                    <h2 className="text-4xl font-extrabold uppercase leading-tight">
                        {titleLine1} <br />
                        <span className="text-primary">{titleLine2}</span>
                    </h2>
                    <p className="text-gray-300 md:text-lg max-w-md leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Right Form Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input
                                    {...register("name")}
                                    placeholder="Nome Completo"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary h-12 rounded-xl"
                                />
                                {errors.name && <span className="text-xs text-red-400 pl-2">{errors.name.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Input
                                    {...register("email")}
                                    placeholder="E-mail"
                                    type="email"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary h-12 rounded-xl"
                                />
                                {errors.name && <span className="text-xs text-red-400 pl-2">{errors.name.message}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <select
                                {...register("interest")}
                                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary h-12 rounded-xl px-3 outline-none appearance-none"
                            >
                                <option value="" className="bg-slate-800">Selecione seu interesse</option>
                                {interestOptions.map((opt: any) => (
                                    <option key={opt.value} value={opt.value} className="bg-slate-800">{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Textarea
                                {...register("details")}
                                placeholder="Detalhes da sua solicitação..."
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary min-h-[120px] rounded-xl resize-none"
                            />
                            {errors.details && <span className="text-xs text-red-400 pl-2">{errors.details.message}</span>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl uppercase tracking-wider"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Enviar Solicitação"}
                        </Button>
                    </form>
                </div>

            </div>
        </section>
    )
}
