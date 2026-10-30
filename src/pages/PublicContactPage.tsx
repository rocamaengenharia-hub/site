import { useState } from 'react'
import { CheckCircle2, Loader2, X, FileUp, Fingerprint, Briefcase } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '../lib/supabase'
import { sanitizeFileName, SAFE_UPLOAD_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '../lib/utils'

const maskCPF = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
}

const maskCNPJ = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
}

const maskPhone = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1')
}

const contactSchema = z.object({
    name: z.string().min(3, 'Preencha seu nome completo'),
    email: z.string().email('E-mail inválido'),
    phone: z.string().min(14, 'Telefone inválido'),
    client_type: z.enum(['PF', 'PJ']),
    document: z.string().min(14, 'Documento incompleto'),
    company: z.string().optional(),
    service_interest: z.string().min(1, 'Selecione o tipo de projeto'),
    message: z.string().min(5, 'Descreva o que você precisa'),
    project_area: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

export const PublicContactPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [files, setFiles] = useState<File[]>([])

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            client_type: 'PF',
            service_interest: '',
            message: '',
            project_area: '',
            company: '',
            document: '',
            phone: ''
        }
    })

    const clientType = form.watch('client_type')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            const allowedTypes: string[] = [
                ...SAFE_UPLOAD_MIME_TYPES.filter(
                    (t) => t.startsWith('image/') || t === 'application/pdf' ||
                        t.startsWith('application/vnd.') || t === 'application/msword'
                ),
            ]
            const validated = newFiles.filter((file) => {
                if (!allowedTypes.includes(file.type)) {
                    alert(`Arquivo "${file.name}" rejeitado: tipo não permitido.`)
                    return false
                }
                if (file.size > MAX_FILE_SIZE_BYTES) {
                    alert(`Arquivo "${file.name}" rejeitado: excede 10MB.`)
                    return false
                }
                return true
            })
            if (validated.length > 0) {
                setFiles(prev => [...prev, ...validated])
            }
        }
    }

    const uploadFiles = async () => {
        const urls: string[] = []
        for (const file of files) {
            const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`
            const filePath = `budgets/${fileName}`
            const safeFile = new File([file], fileName, { type: file.type })
            const { error } = await supabase.storage.from('projects').upload(filePath, safeFile)
            if (!error) {
                const { data: { publicUrl } } = supabase.storage.from('projects').getPublicUrl(filePath)
                urls.push(publicUrl)
            }
        }
        return urls
    }

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true)
        try {
            const attachmentUrls = await uploadFiles()

            // Visitante não lê nem altera clients/budgets: a função no banco grava tudo de uma vez
            const { error: submitErr } = await supabase.rpc('submit_budget_request', {
                p_name: data.name,
                p_email: data.email,
                p_phone: data.phone,
                p_company: data.company,
                p_client_type: data.client_type,
                p_document: data.document,
                p_service_interest: `${data.service_interest} | Área: ${data.project_area || 'N/A'}`,
                p_message: data.message,
                p_attachments: attachmentUrls,
            })

            if (submitErr) throw submitErr
            setIsSuccess(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (error) {
            console.error('Submission Error:', error)
            alert('Erro ao enviar. Por favor, tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <header className="bg-slate-950 text-white pt-48 pb-20 relative overflow-hidden border-b border-white/5">
                <div className="container mx-auto px-6 relative z-10">
                    <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">Solicite seu orçamento</p>
                    <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight leading-tight">
                        {isSuccess ? 'Recebemos sua solicitação!' : 'Peça seu orçamento'}
                    </h1>
                    {!isSuccess && (
                        <p className="text-slate-400 text-lg mt-4 max-w-2xl">
                            Preencha o formulário abaixo e nossa equipe entrará em contato em até 24 horas.
                        </p>
                    )}
                </div>
            </header>

            <main className="flex-grow bg-white py-16 px-6">
                <div className="container mx-auto max-w-3xl">
                    {isSuccess ? (
                        <div className="py-20 text-center space-y-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-10 h-10 text-green-600" strokeWidth={2} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-3xl font-heading font-bold text-slate-900">Orçamento enviado com sucesso!</h2>
                                <p className="text-slate-600 text-lg max-w-md mx-auto">
                                    Nossa equipe de engenharia vai analisar sua solicitação e entrar em contato em até 24 horas.
                                </p>
                            </div>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="inline-flex items-center justify-center px-8 py-4 bg-slate-950 text-white font-bold rounded-lg text-base hover:bg-slate-800 transition-colors"
                            >
                                Voltar para a página inicial
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

                            {/* TIPO DE PROJETO */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900">Qual tipo de projeto?</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['Residencial', 'Comercial', 'Industrial', 'Projetos'].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => form.setValue('service_interest', opt)}
                                            className={`p-5 border-2 rounded-lg text-center font-bold text-sm transition-colors ${form.watch('service_interest') === opt
                                                ? 'border-primary bg-primary/10 text-slate-900'
                                                : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                {form.formState.errors.service_interest && (
                                    <p className="text-red-500 text-sm">{form.formState.errors.service_interest.message}</p>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 block">Área aproximada (m²)</label>
                                    <input
                                        {...form.register('project_area')}
                                        className="w-full h-14 px-4 bg-white border-2 border-slate-200 rounded-lg text-lg font-bold focus:border-primary outline-none transition-colors"
                                        placeholder="Ex: 200"
                                    />
                                </div>
                            </section>

                            {/* IDENTIFICAÇÃO */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900">Seus dados</h2>

                                <div className="flex gap-3">
                                    {[
                                        { id: 'PF' as const, label: 'Pessoa Física', icon: Fingerprint },
                                        { id: 'PJ' as const, label: 'Pessoa Jurídica', icon: Briefcase }
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => {
                                                form.setValue('client_type', type.id)
                                                form.setValue('document', '')
                                            }}
                                            className={`flex-1 p-4 border-2 rounded-lg flex items-center justify-center gap-3 font-bold text-sm transition-colors ${form.watch('client_type') === type.id
                                                ? 'border-primary bg-primary/10 text-slate-900'
                                                : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            <type.icon className="h-5 w-5" />
                                            {type.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 block">
                                            {clientType === 'PF' ? 'CPF' : 'CNPJ'}
                                        </label>
                                        <input
                                            {...form.register('document')}
                                            onChange={(e) => {
                                                const masked = clientType === 'PF' ? maskCPF(e.target.value) : maskCNPJ(e.target.value)
                                                form.setValue('document', masked)
                                            }}
                                            className="w-full h-14 px-4 bg-white border-2 border-slate-200 rounded-lg text-lg focus:border-primary outline-none transition-colors"
                                            placeholder={clientType === 'PF' ? "000.000.000-00" : "00.000.000/0000-00"}
                                        />
                                        {form.formState.errors.document && (
                                            <p className="text-red-500 text-sm">{form.formState.errors.document.message}</p>
                                        )}
                                    </div>

                                    {clientType === 'PJ' && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 block">Nome da empresa</label>
                                            <input
                                                {...form.register('company')}
                                                className="w-full h-14 px-4 bg-white border-2 border-slate-200 rounded-lg text-lg focus:border-primary outline-none transition-colors"
                                                placeholder="Razão social"
                                            />
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* CONTATO */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900">Contato</h2>
                                <div className="grid md:grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 block">Nome completo</label>
                                        <input
                                            {...form.register('name')}
                                            className="w-full h-14 px-4 bg-white border-2 border-slate-200 rounded-lg text-lg focus:border-primary outline-none transition-colors"
                                            placeholder="Seu nome"
                                        />
                                        {form.formState.errors.name && (
                                            <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 block">E-mail</label>
                                            <input
                                                {...form.register('email')}
                                                className="w-full h-14 px-4 bg-white border-2 border-slate-200 rounded-lg text-lg focus:border-primary outline-none transition-colors"
                                                placeholder="seu@email.com"
                                            />
                                            {form.formState.errors.email && (
                                                <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 block">Telefone / WhatsApp</label>
                                            <input
                                                {...form.register('phone')}
                                                onChange={(e) => form.setValue('phone', maskPhone(e.target.value))}
                                                className="w-full h-14 px-4 bg-white border-2 border-slate-200 rounded-lg text-lg focus:border-primary outline-none transition-colors"
                                                placeholder="(00) 00000-0000"
                                            />
                                            {form.formState.errors.phone && (
                                                <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* DETALHES */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900">Detalhes do projeto</h2>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 block">O que você precisa?</label>
                                    <textarea
                                        {...form.register('message')}
                                        className="w-full h-40 p-4 bg-white border-2 border-slate-200 rounded-lg text-base focus:border-primary outline-none resize-none transition-colors"
                                        placeholder="Descreva seu projeto, necessidades, prazos..."
                                    />
                                    {form.formState.errors.message && (
                                        <p className="text-red-500 text-sm">{form.formState.errors.message.message}</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-slate-700 block">
                                        Anexar arquivos <span className="text-slate-400 font-normal">(plantas, fotos, PDFs — opcional)</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-primary transition-colors">
                                            <FileUp className="h-8 w-8 text-slate-300 mb-3" />
                                            <p className="text-sm text-slate-500 font-medium">Clique aqui ou arraste seus arquivos</p>
                                            <p className="text-xs text-slate-400 mt-1">Máximo 10MB por arquivo</p>
                                        </div>
                                    </div>
                                    {files.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {files.map((f, i) => (
                                                <div key={i} className="px-3 py-2 bg-slate-100 rounded-lg text-sm flex items-center gap-2">
                                                    <span className="text-slate-700 truncate max-w-[200px]">{f.name}</span>
                                                    <X className="h-4 w-4 cursor-pointer text-slate-400 hover:text-red-500 transition-colors" onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-16 bg-primary text-slate-950 font-bold text-lg rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Enviando...
                                    </>
                                ) : (
                                    'Enviar orçamento'
                                )}
                            </button>

                            <p className="text-center text-sm text-slate-400">
                                Responderemos em até 24 horas por e-mail ou telefone.
                            </p>
                        </form>
                    )}
                </div>
            </main>
        </div>
    )
}
