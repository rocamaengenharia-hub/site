import { Link } from 'react-router-dom'
import { useForm, useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { useUpdatePageContent } from './useSiteContent'
import { FOOTER_DEFAULTS, getSafeLink, usePageFooter, type FooterContent } from './footerContent'

type LinkListName = 'nav_links' | 'specialties' | 'bottom_links'

const LinkListEditor = ({ name, control, register, addLabel }: {
    name: LinkListName
    control: Control<FooterContent>
    register: UseFormRegister<FooterContent>
    addLabel: string
}) => {
    const { fields, append, remove } = useFieldArray({ control, name })

    return (
        <div className="space-y-3">
            {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                    <div className="space-y-1">
                        {index === 0 && <Label className="text-xs text-muted-foreground">Texto</Label>}
                        <Input {...register(`${name}.${index}.label` as const)} placeholder="Ex: Nossos Serviços" />
                    </div>
                    <div className="space-y-1">
                        {index === 0 && <Label className="text-xs text-muted-foreground">Link</Label>}
                        <Input {...register(`${name}.${index}.url` as const)} placeholder="/servicos ou https://..." />
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => append({ label: '', url: '' })}
                className="w-full border-dashed"
            >
                <Plus className="mr-2 h-4 w-4" />
                {addLabel}
            </Button>
        </div>
    )
}

export const FooterEditor = () => {
    const { data: pageData, isLoading } = usePageFooter()

    if (isLoading) return <div>Carregando...</div>

    // O formulário só nasce depois de carregar, já com o conteúdo salvo. Com reset() depois de
    // montar, as listas misturavam o salvo com o padrão (sobravam os itens extras do padrão).
    return <FooterForm initial={{ ...FOOTER_DEFAULTS, ...(pageData?.content ?? {}) }} />
}

const FooterForm = ({ initial }: { initial: FooterContent }) => {
    const { mutateAsync: updateContent, isPending: isSaving } = useUpdatePageContent()

    const { register, control, handleSubmit } = useForm<FooterContent>({ defaultValues: initial })

    const onSubmit = async (data: FooterContent) => {
        // Linhas totalmente vazias são descartadas; link preenchido precisa ser válido
        const clean = (links: FooterContent['nav_links']) =>
            links.filter((l) => (l.label || '').trim() || (l.url || '').trim())
        const content = {
            ...data,
            nav_links: clean(data.nav_links),
            specialties: clean(data.specialties),
            bottom_links: clean(data.bottom_links),
        }

        const invalid = [...content.nav_links, ...content.specialties, ...content.bottom_links]
            .filter((l) => !(l.label || '').trim() || !getSafeLink(l.url))
        if (invalid.length > 0) {
            alert(
                'Corrija estes links antes de salvar (precisam de texto e de um link que comece com "/" ou "https://"):\n\n' +
                invalid.map((l) => `• ${l.label || '(sem texto)'} → ${l.url || '(sem link)'}`).join('\n')
            )
            return
        }

        try {
            await updateContent({ slug: 'footer', section: 'main', content })
            alert('Rodapé atualizado!')
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar.')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Marca</CardTitle>
                    <CardDescription>
                        Nome e apresentação no rodapé de todas as páginas. Endereço, WhatsApp, e-mail e redes sociais
                        são editados em <Link to="/admin/settings" className="underline">Configurações</Link>.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Nome</Label>
                            <Input {...register('brand_title')} />
                        </div>
                        <div className="space-y-2">
                            <Label>Linha abaixo do nome</Label>
                            <Input {...register('brand_subtitle')} placeholder="Deixe vazio para esconder" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Frase de apresentação</Label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            placeholder="Deixe vazio para esconder"
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Colunas de links</CardTitle>
                    <CardDescription>
                        Link do próprio site começa com "/" (ex.: /servicos). Link externo começa com "https://".
                        Coluna sem nenhum link some do rodapé.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label>Título da 1ª coluna</Label>
                            <Input {...register('nav_title')} />
                        </div>
                        <LinkListEditor name="nav_links" control={control} register={register} addLabel="Adicionar link" />
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label>Título da 2ª coluna</Label>
                            <Input {...register('specialties_title')} />
                        </div>
                        <LinkListEditor name="specialties" control={control} register={register} addLabel="Adicionar especialidade" />
                    </div>

                    <div className="space-y-2">
                        <Label>Título da coluna de contato</Label>
                        <Input {...register('contact_title')} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Faixa inferior</CardTitle>
                    <CardDescription>O ano atual entra sozinho antes do texto (ex.: © 2026 ...).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Texto de direitos autorais</Label>
                        <Input {...register('copyright')} placeholder="Deixe vazio para esconder" />
                    </div>
                    <div className="space-y-3">
                        <Label>Links da faixa inferior</Label>
                        <LinkListEditor name="bottom_links" control={control} register={register} addLabel="Adicionar link" />
                    </div>
                </CardContent>
            </Card>

            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
            </Button>
        </form>
    )
}
