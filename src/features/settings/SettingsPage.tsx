import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSettings, useUpdateSettings } from './useSettings'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Loader2, Save } from 'lucide-react'
import { FileUpload } from '../../components/ui/file-upload'
import { useUploadServiceMedia } from '../services/useServices'
import { sanitizeFileName } from '../../lib/utils'

const settingsSchema = z.object({
    company_name: z.string().min(1, 'Nome da empresa é obrigatório'),
    contact_email: z.string().email('E-mail inválido').optional().or(z.literal('')),
    whatsapp: z.string().optional(),
    instagram_url: z.string().url('URL inválida').optional().or(z.literal('')),
    facebook_url: z.string().url('URL inválida').optional().or(z.literal('')),
    linkedin_url: z.string().url('URL inválida').optional().or(z.literal('')),
    address: z.string().optional(),
    logo_url: z.string().optional(),
    navbar_bg_color: z.string().optional(),
    navbar_text_color: z.string().optional(),
})

type SettingsFormData = z.infer<typeof settingsSchema>

export const SettingsPage = () => {
    const { data: settings, isLoading } = useSettings()
    const { mutateAsync: updateSettings, isPending: isSaving } = useUpdateSettings()
    const { mutateAsync: uploadMedia } = useUploadServiceMedia() // Can reuse this, or generic upload

    const [uploadingLogo, setUploadingLogo] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            company_name: '',
            contact_email: '',
            whatsapp: '',
            instagram_url: '',
            facebook_url: '',
            linkedin_url: '',
            address: '',
            logo_url: '',
            navbar_bg_color: '',
            navbar_text_color: '',
        }
    })

    const logoUrl = watch('logo_url')

    useEffect(() => {
        if (settings) {
            reset({
                company_name: settings.company_name || '',
                contact_email: settings.contact_email || '',
                whatsapp: settings.whatsapp || '',
                instagram_url: settings.instagram_url || '',
                facebook_url: settings.facebook_url || '',
                linkedin_url: settings.linkedin_url || '',
                address: settings.address || '',
                logo_url: settings.logo_url || '',
                navbar_bg_color: settings.navbar_bg_color || '',
                navbar_text_color: settings.navbar_text_color || '',
            })
        }
    }, [settings, reset])

    const onSubmit = async (data: SettingsFormData) => {
        try {
            await updateSettings(data)
            alert('Configurações salvas com sucesso!')
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar configurações.')
        }
    }

    if (isLoading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configurações Gerais</h1>
                <p className="text-muted-foreground">
                    Gerencie as informações principais do site e da empresa.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Identidade Visual</CardTitle>
                        <CardDescription>
                            Logo e nome da empresa exibidos no site.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Logo da Empresa</Label>
                            <div className="flex flex-col gap-4">
                                {logoUrl && (
                                    <div className="relative w-40 h-40 border rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center p-2">
                                        <img src={logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}
                                <FileUpload
                                    accept={{ 'image/*': [] as string[] }} // Cast to satisfy type
                                    maxFiles={1}
                                    value={[]}
                                    onChange={async (files) => {
                                        if (files.length > 0) {
                                            setUploadingLogo(true)
                                            try {
                                                const file = files[0]
                                                const path = `settings/logo-${Date.now()}-${sanitizeFileName(file.name)}`
                                                // Note: reusing service media upload, might want a shared bucket eventually
                                                // but for now let's hope 'services' bucket is okay or we need 'public' bucket
                                                // Ideally use 'public' standard bucket. Let's assume generic useUploadServiceMedia uses 'services' bucket.
                                                // It might be better to create a 'public' bucket for site assets.
                                                // For now, use existing hook.
                                                const url = await uploadMedia({ file, path })
                                                setValue('logo_url', url, { shouldDirty: true })
                                            } catch (e) {
                                                console.error(e)
                                                alert("Erro ao enviar logo")
                                            } finally {
                                                setUploadingLogo(false)
                                            }
                                        }
                                    }}
                                    label={uploadingLogo ? "Enviando..." : "Alterar Logo"}
                                    disabled={uploadingLogo}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="company_name">Nome da Empresa</Label>
                            <Input id="company_name" {...register('company_name')} />
                            {errors.company_name && <p className="text-destructive text-xs">{errors.company_name.message}</p>}
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="navbar_bg_color">Cor de Fundo do Menu</Label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        id="navbar_bg_color_picker"
                                        value={watch('navbar_bg_color') || '#ffffff'}
                                        onChange={(e) => setValue('navbar_bg_color', e.target.value, { shouldDirty: true })}
                                        className="w-10 h-10 rounded border cursor-pointer"
                                    />
                                    <Input
                                        id="navbar_bg_color"
                                        placeholder="#ffffff"
                                        {...register('navbar_bg_color')}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Cor do fundo com blur da barra de navegação</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="navbar_text_color">Cor do Texto do Menu</Label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        id="navbar_text_color_picker"
                                        value={watch('navbar_text_color') || '#ffffff'}
                                        onChange={(e) => setValue('navbar_text_color', e.target.value, { shouldDirty: true })}
                                        className="w-10 h-10 rounded border cursor-pointer"
                                    />
                                    <Input
                                        id="navbar_text_color"
                                        placeholder="#ffffff"
                                        {...register('navbar_text_color')}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Cor dos links de navegação</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contato e Redes Sociais</CardTitle>
                        <CardDescription>
                            Como os clientes podem entrar em contato. Aparecem no rodapé do site; as redes sociais
                            deixadas em branco não aparecem.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="contact_email">E-mail de Contato</Label>
                            <Input id="contact_email" type="email" placeholder="contato@empresa.com" {...register('contact_email')} />
                            {errors.contact_email && <p className="text-destructive text-xs">{errors.contact_email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp / Telefone</Label>
                            <Input id="whatsapp" placeholder="(11) 99999-9999" {...register('whatsapp')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="instagram_url">Instagram</Label>
                            <Input id="instagram_url" placeholder="https://instagram.com/..." {...register('instagram_url')} />
                            {errors.instagram_url && <p className="text-destructive text-xs">{errors.instagram_url.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="facebook_url">Facebook</Label>
                            <Input id="facebook_url" placeholder="https://facebook.com/..." {...register('facebook_url')} />
                            {errors.facebook_url && <p className="text-destructive text-xs">{errors.facebook_url.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="linkedin_url">LinkedIn</Label>
                            <Input id="linkedin_url" placeholder="https://linkedin.com/..." {...register('linkedin_url')} />
                            {errors.linkedin_url && <p className="text-destructive text-xs">{errors.linkedin_url.message}</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Endereço Completo</Label>
                            <Textarea id="address" placeholder="Rua, Número, Bairro, Cidade - UF" {...register('address')} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10">
                    <Button type="submit" disabled={isSaving || uploadingLogo}>
                        {(isSaving || uploadingLogo) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Alterações
                    </Button>
                </div>
            </form>
        </div>
    )
}
