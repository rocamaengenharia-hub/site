import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
import { AdminLayout } from './components/layout/AdminLayout'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { ServicesPage } from './features/services/ServicesPage'
import { CreateServicePage } from './features/services/CreateServicePage'
import { EditServicePage } from './features/services/EditServicePage'
import { ServiceDetailsPage } from './features/services/ServiceDetailsPage'
import { BudgetsPage } from './features/budgets/BudgetsPage'
import { BudgetDetailsPage } from './features/budgets/BudgetDetailsPage'
import { ClientsPage } from './features/clients/ClientsPage'
import { CreateClientPage } from './features/clients/CreateClientPage'
import { EditClientPage } from './features/clients/EditClientPage'
import { SettingsPage } from './features/settings/SettingsPage'
import { SiteEditorPage } from './features/site-editor/SiteEditorPage'
import { ProjectsPage } from './features/projects/ProjectsPage'
import { CreateProjectPage } from './features/projects/CreateProjectPage'
import { EditProjectPage } from './features/projects/EditProjectPage'
import { ProjectDetailsPage } from './features/projects/ProjectDetailsPage'
import { PublicProjectDetailsPage } from './features/projects/PublicProjectDetailsPage'
import { PublicServiceDetailsPage } from './features/services/PublicServiceDetailsPage'

import { PublicLayout } from './components/layout/PublicLayout'
import { HomePage } from './pages/HomePage'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { AboutPage } from './pages/AboutPage'
import { PublicServicesPage } from './pages/PublicServicesPage'

import { PublicProjectsPage } from './pages/PublicProjectsPage'
import { PublicBlogPage } from './pages/PublicBlogPage'
import { PublicPostDetailsPage } from './features/blog/PublicPostDetailsPage'
import { PublicContactPage } from './pages/PublicContactPage'
import { AdminPostsPage } from './features/blog/AdminPostsPage'
import { CreatePostPage } from './features/blog/CreatePostPage'
import { EditPostPage } from './features/blog/EditPostPage'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre-nos" element={<AboutPage />} />
          <Route path="/servicos" element={<PublicServicesPage />} />
          <Route path="/servicos/:id" element={<PublicServiceDetailsPage />} />
          <Route path="/projetos" element={<PublicProjectsPage />} />
          <Route path="/projetos/:id" element={<PublicProjectDetailsPage />} />
          <Route path="/blog" element={<PublicBlogPage />} />
          <Route path="/blog/:slug" element={<PublicPostDetailsPage />} />
          <Route path="/treinamentos" element={<div>Treinamentos - Em breve</div>} />
          <Route path="/contato" element={<PublicContactPage />} />
        </Route>

        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/new" element={<CreateServicePage />} />
            <Route path="services/:id" element={<ServiceDetailsPage />} />
            <Route path="services/:id/edit" element={<EditServicePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/new" element={<CreateProjectPage />} />
            <Route path="projects/:id" element={<ProjectDetailsPage />} />
            <Route path="projects/:id/edit" element={<EditProjectPage />} />
            <Route path="budgets" element={<BudgetsPage />} />
            <Route path="budgets/:id" element={<BudgetDetailsPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/new" element={<CreateClientPage />} />
            <Route path="clients/:id" element={<EditClientPage />} />
            <Route path="clients/:id/edit" element={<EditClientPage />} />
            <Route path="blog" element={<AdminPostsPage />} />
            <Route path="blog/new" element={<CreatePostPage />} />
            <Route path="blog/:id/edit" element={<EditPostPage />} />
            <Route path="site-editor" element={<SiteEditorPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
