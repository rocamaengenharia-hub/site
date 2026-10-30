import { Link, Outlet } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useSettings } from '../../features/settings/useSettings'
import { PublicFooter } from './PublicFooter'
import { Menu, X, HardHat } from 'lucide-react'
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

            <PublicFooter />
        </div>
    )
}
