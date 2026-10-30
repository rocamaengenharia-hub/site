import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from 'lucide-react'
import { useSettings } from '../../features/settings/useSettings'
import { useFooterContent, getSafeLink, type FooterLink } from '../../features/site-editor/footerContent'

const FooterLinkItem = ({ link, className, children }: { link: FooterLink, className: string, children: ReactNode }) => {
    const safe = getSafeLink(link.url)
    if (!safe || !link.label?.trim()) return null

    if (safe.internal) {
        return <Link to={safe.href} className={className}>{children}</Link>
    }
    return (
        <a href={safe.href} target="_blank" rel="noopener noreferrer" className={className}>
            {children}
        </a>
    )
}

export const PublicFooter = () => {
    const { data: settings } = useSettings()
    const content = useFooterContent()

    // Redes sociais vêm de Configurações; só aparecem as preenchidas com link http(s)
    const socials = [
        { label: 'Instagram', url: settings?.instagram_url, Icon: Instagram },
        { label: 'Facebook', url: settings?.facebook_url, Icon: Facebook },
        { label: 'LinkedIn', url: settings?.linkedin_url, Icon: Linkedin },
    ].filter(({ url }) => getSafeLink(url)?.internal === false)

    const hasContact = !!(settings?.address || settings?.whatsapp || settings?.contact_email)

    return (
        <footer className="bg-slate-950 text-white pt-20 pb-8 border-t border-slate-900">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="flex flex-col leading-none">
                            <span className="font-heading font-bold text-3xl tracking-tighter text-white">{content.brand_title}</span>
                            {content.brand_subtitle && (
                                <span className="text-xs tracking-[0.3em] uppercase text-gray-300 font-medium">{content.brand_subtitle}</span>
                            )}
                        </div>
                        {content.description && (
                            <p className="text-gray-200 text-sm leading-relaxed max-w-xs">
                                {content.description}
                            </p>
                        )}
                        {socials.length > 0 && (
                            <div className="flex items-center gap-3">
                                {socials.map(({ label, url, Icon }) => (
                                    <a
                                        key={label}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        title={label}
                                        className="h-11 w-11 flex items-center justify-center border border-slate-800 text-gray-200 hover:text-white hover:border-primary transition-colors"
                                    >
                                        <Icon className="h-5 w-5" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    {content.nav_links.length > 0 && (
                        <div className="md:col-span-1">
                            <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-6 text-primary">{content.nav_title}</h4>
                            <ul className="space-y-3 text-sm text-gray-200">
                                {content.nav_links.map((link, index) => (
                                    <li key={`${link.label}-${index}`}>
                                        <FooterLinkItem link={link} className="hover:text-white transition-colors flex items-center gap-2 group">
                                            <span className="w-0 group-hover:w-2 h-px bg-primary transition-all"></span>
                                            {link.label}
                                        </FooterLinkItem>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Services */}
                    {content.specialties.length > 0 && (
                        <div className="md:col-span-1">
                            <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-6 text-primary">{content.specialties_title}</h4>
                            <ul className="space-y-3 text-sm text-gray-200">
                                {content.specialties.map((link, index) => (
                                    <li key={`${link.label}-${index}`}>
                                        <FooterLinkItem link={link} className="hover:text-white transition-colors">
                                            {link.label}
                                        </FooterLinkItem>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Contact */}
                    {hasContact && (
                        <div className="md:col-span-1">
                            <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-6 text-primary">{content.contact_title}</h4>
                            <ul className="space-y-4">
                                {settings?.address && (
                                    <li className="flex items-start gap-4 text-gray-200">
                                        <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <span className="text-sm leading-relaxed">{settings.address}</span>
                                    </li>
                                )}
                                {settings?.whatsapp && (
                                    <li className="flex items-center gap-4 text-gray-200">
                                        <Phone className="h-5 w-5 text-primary shrink-0" />
                                        <span className="text-sm">{settings.whatsapp}</span>
                                    </li>
                                )}
                                {settings?.contact_email && (
                                    <li className="flex items-center gap-4 text-gray-200">
                                        <Mail className="h-5 w-5 text-primary shrink-0" />
                                        <span className="text-sm">{settings.contact_email}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium uppercase tracking-wider">
                    {content.copyright && <p>© {new Date().getFullYear()} {content.copyright}</p>}
                    {content.bottom_links.length > 0 && (
                        <div className="flex items-center gap-8">
                            {content.bottom_links.map((link, index) => (
                                <FooterLinkItem key={`${link.label}-${index}`} link={link} className="hover:text-white transition-colors">
                                    {link.label}
                                </FooterLinkItem>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    )
}
