import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { supabase } from '../../lib/supabase'
import {
    LayoutDashboard,
    Package,
    Users,
    FileText,
    Settings,
    MoreHorizontal,
    PanelTop,
    HardHat,
    FileEdit,
    LogOut,
    X
} from 'lucide-react'

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Serviços',
        href: '/admin/services',
        icon: Package,
    },
    {
        title: 'Obras Realizadas',
        href: '/admin/projects',
        icon: HardHat,
    },
    {
        title: 'Orçamentos',
        href: '/admin/budgets',
        icon: FileText,
    },
    {
        title: 'Clientes',
        href: '/admin/clients',
        icon: Users,
    },
    {
        title: 'Postagens (Blog)',
        href: '/admin/blog',
        icon: FileEdit,
    },
    {
        title: 'Editor do Site',
        href: '/admin/site-editor',
        icon: PanelTop,
    },
    {
        title: 'Configurações',
        href: '/admin/settings',
        icon: Settings,
    },
]

interface SidebarProps {
    onClose?: () => void
    mobile?: boolean
}

export const Sidebar = ({ onClose, mobile }: SidebarProps) => {
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    return (
        <aside className={cn(
            "h-screen w-[280px] flex-col bg-[#121212] p-[20px] text-white border-r-0",
            mobile ? "flex" : "hidden md:flex"
        )}>
            {/* Mobile Close Button */}
            {mobile && onClose && (
                <button
                    onClick={onClose}
                    className="self-end mb-2 p-2 text-[rgba(255,255,255,0.6)] hover:text-white transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            )}

            {/* Logo / Brand Section */}
            <div className="mb-8 bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-[12px] flex items-center gap-[12px]">
                <div className="bg-white rounded-[10px] w-[36px] h-[36px] flex items-center justify-center shrink-0">
                    <div className="w-[20px] h-[20px] border-[3px] border-black rounded-[4px] rotate-45 flex items-center justify-center">
                        <div className="w-[6px] h-[6px] bg-black rounded-full" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[13px] font-bold tracking-tight text-white leading-tight">ROCAMA ENGENHARIA</span>
                    <span className="text-[11px] font-medium text-[rgba(255,255,255,0.6)]">Administrador</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-[4px]">
                {sidebarItems.map((item) => {
                    const isActive = item.href === '/admin'
                        ? location.pathname === '/admin'
                        : location.pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "group flex items-center gap-[12px] rounded-[12px] p-[12px] text-[14px] font-medium transition-all duration-200",
                                isActive
                                    ? "bg-white text-[#121212] shadow-sm"
                                    : "text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                            )}
                        >
                            <item.icon className={cn("h-[20px] w-[20px]", isActive ? "text-[#121212]" : "text-[rgba(255,255,255,0.6)] group-hover:text-white")} />
                            <span>{item.title}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile */}
            <div className="mt-auto pt-6 border-t border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-[12px] p-[4px] rounded-[16px] hover:bg-[rgba(255,255,255,0.05)] cursor-pointer transition-colors">
                    <div className="size-[40px] rounded-full bg-[#E4E4E5] flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-[rgba(255,255,255,0.1)]">
                        <img
                            src="https://ui-avatars.com/api/?name=Rocama+Engenharia&background=0D8ABC&color=fff"
                            alt="Rocama Engenharia"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-[14px] font-semibold leading-tight text-white truncate">Rocama Engenharia</p>
                        <p className="text-[12px] text-[rgba(255,255,255,0.5)] truncate">engenhariarocama@gmail.com</p>
                    </div>
                    <MoreHorizontal className="h-[20px] w-[20px] text-[rgba(255,255,255,0.4)]" />
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="mt-4 flex items-center gap-[12px] w-full p-[12px] rounded-[12px] text-[14px] font-medium text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200"
                >
                    <LogOut className="h-[20px] w-[20px]" />
                    <span>Sair</span>
                </button>
            </div>
        </aside>

    )
}
