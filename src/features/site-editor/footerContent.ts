import { usePageContent } from './useSiteContent'

export interface FooterLink {
    label: string
    url: string
}

export interface FooterContent {
    brand_title: string
    brand_subtitle: string
    description: string
    nav_title: string
    nav_links: FooterLink[]
    specialties_title: string
    specialties: FooterLink[]
    contact_title: string
    copyright: string
    bottom_links: FooterLink[]
}

// Mesmos textos que o rodapé tinha fixos no código, para nada mudar até o admin editar
export const FOOTER_DEFAULTS: FooterContent = {
    brand_title: 'ROCAMA',
    brand_subtitle: 'Engenharia System',
    description: 'Transformando visões em estruturas concretas. Excelência, inovação e compromisso em cada metro quadrado construído.',
    nav_title: 'Navegação',
    nav_links: [
        { label: 'Sobre a Empresa', url: '/sobre-nos' },
        { label: 'Nossos Serviços', url: '/servicos' },
        { label: 'Portfólio Recente', url: '/projetos' },
        { label: 'Entre em Contato', url: '/contato' },
    ],
    specialties_title: 'Especialidades',
    specialties: [
        { label: 'Construção Civil', url: '/servicos' },
        { label: 'Reformas de Alto Padrão', url: '/servicos' },
        { label: 'Projetos Arquitetônicos', url: '/servicos' },
        { label: 'Consultoria Técnica', url: '/servicos' },
    ],
    contact_title: 'Contato',
    copyright: 'Rocama Engenharia. Todos os direitos reservados.',
    bottom_links: [
        { label: 'Política de Privacidade', url: '/contato' },
        { label: 'Termos de Uso', url: '/contato' },
    ],
}

export const usePageFooter = () => usePageContent('footer', 'main')

// Campo salvo vence o padrão mesmo vazio: é assim que o admin consegue apagar um texto ou uma lista
export const useFooterContent = (): FooterContent => {
    const { data } = usePageFooter()
    return { ...FOOTER_DEFAULTS, ...(data?.content ?? {}) }
}

// Aceita só caminho do próprio site ("/contato") ou http(s); o resto (ex.: "javascript:") não vira link
export const getSafeLink = (url: string | undefined): { internal: boolean, href: string } | null => {
    const value = url?.trim() ?? ''
    if (value.startsWith('/') && !value.startsWith('//')) return { internal: true, href: value }
    if (/^https?:\/\/\S+$/i.test(value)) return { internal: false, href: value }
    return null
}
