import { Link, Outlet } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useSettings } from '../../features/settings/useSettings'
import { Menu, X, HardHat, MapPin, Phone, Mail } from 'lucide-react'
import { useState, useEffect } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

export const PublicLayout = () => {
    const { data: settings } = useSettings()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white">
            {/* Header - Absolute to overlay content and provide a permanent blur effect without following scroll */}
            <header
                className={cn(
                    "absolute top-0 left-0 z-50 w-full transition-all duration-500",
                    "backdrop-blur-[12px] border-b border-white/10",
                    scrolled ? "py-3 shadow-sm" : "py-5"
                )}
                style={{
                    backgroundColor: settings?.navbar_bg_color
                        ? `${settings.navbar_bg_color}${scrolled ? '66' : '0d'}`
                        : scrolled ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.05)',
                }}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo - Left aligned */}
                    <div className="flex-none">
                        <Link to="/" className="flex items-center gap-2 group">
                            {settings?.logo_url ? (
                                <img src={settings.logo_url} alt={settings.company_name} className="h-10 w-auto" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="bg-slate-900 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                                        <HardHat className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-[22px] font-bold tracking-tight drop-shadow-sm" style={{ color: settings?.navbar_text_color || '#ffffff' }}>
                                        ROCAMA
                                    </span>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Desktop Navigation - Centered in the available space */}
                    <nav className="hidden lg:flex flex-1 justify-center items-center gap-10">
                        {[
                            { label: 'Home', path: '/' },
                            { label: 'Quem Somos', path: '/sobre-nos' },
                            { label: 'Serviços', path: '/servicos' },
                            { label: 'Portfólio', path: '/projetos' },
                            { label: 'Blog', path: '/blog' },
                            { label: 'Contato', path: '/contato' }
                        ].map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                className="text-[14px] font-semibold hover:text-red-600 transition-colors duration-200 drop-shadow-sm"
                                style={{ color: settings?.navbar_text_color || '#ffffff' }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right spacer for centering navigation - Hidden on small screen */}
                    <div className="flex-none w-[140px] hidden lg:block" />

                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden p-2" style={{ color: settings?.navbar_text_color || '#ffffff' }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="absolute inset-x-4 top-20 bg-slate-900/95 backdrop-blur-xl rounded-[24px] shadow-2xl border border-white/10 lg:hidden overflow-hidden z-50 text-white"
                        >
                            <nav className="p-8 flex flex-col gap-6 text-center">
                                {[
                                    { label: 'Home', path: '/' },
                                    { label: 'Quem Somos', path: '/sobre-nos' },
                                    { label: 'Serviços', path: '/servicos' },
                                    { label: 'Portfólio', path: '/projetos' },
                                    { label: 'Blog', path: '/blog' },
                                    { label: 'Contato', path: '/contato' }
                                ].map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        className="text-lg font-bold text-white hover:text-red-500"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Premium Footer */}
            <footer className="bg-slate-950 text-white pt-20 pb-8 border-t border-slate-900">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        {/* Brand */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="flex flex-col leading-none">
                                <span className="font-heading font-bold text-3xl tracking-tighter text-white">ROCAMA</span>
                                <span className="text-xs tracking-[0.3em] uppercase text-gray-300 font-medium">Engenharia System</span>
                            </div>
                            <p className="text-gray-200 text-sm leading-relaxed max-w-xs">
                                Transformando visões em estruturas concretas. Excelência, inovação e compromisso em cada metro quadrado construído.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="md: col-span-1">
                            <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-6 text-primary">Navegação</h4>
                            <ul className="space-y-3 text-sm text-gray-200">
                                <li>
                                    <Link to="/sobre-nos" className="hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-2 h-px bg-primary transition-all"></span>
                                        Sobre a Empresa
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/servicos" className="hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-2 h-px bg-primary transition-all"></span>
                                        Nossos Serviços
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/projetos" className="hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-2 h-px bg-primary transition-all"></span>
                                        Portfólio Recente
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contato" className="hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-2 h-px bg-primary transition-all"></span>
                                        Entre em Contato
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div className="md:col-span-1">
                            <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-6 text-primary">Especialidades</h4>
                            <ul className="space-y-3 text-sm text-gray-200">
                                {['Construção Civil', 'Reformas de Alto Padrão', 'Projetos Arquitetônicos', 'Consultoria Técnica'].map((link) => (
                                    <li key={link}>
                                        <Link to="/servicos" className="hover:text-white transition-colors">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="md:col-span-1">
                            <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-6 text-primary">Contato</h4>
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
                    </div>

                    <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium uppercase tracking-wider">
                        <p>© {new Date().getFullYear()} Rocama Engenharia. Todos os direitos reservados.</p>
                        <div className="flex items-center gap-8">
                            <Link to="/contato" className="hover:text-white transition-colors">Política de Privacidade</Link>
                            <Link to="/contato" className="hover:text-white transition-colors">Termos de Uso</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
