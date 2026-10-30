import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'

export const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen bg-[#121212] overflow-hidden">
            <Sidebar />

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative z-50 h-full w-[280px]">
                        <Sidebar mobile onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            <div className="flex-1 p-2 h-full overflow-hidden flex flex-col">
                {/* Mobile Header (Hidden on md) */}
                <header className="flex h-16 items-center justify-between border-b bg-card px-6 md:hidden rounded-t-[24px]">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <span className="text-lg font-bold">Rocama</span>
                    <div className="w-10" />
                </header>

                <main className="flex-1 overflow-y-auto bg-white rounded-b-[24px] md:rounded-[24px] p-8 border border-[#ededed] overscroll-none h-full">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
