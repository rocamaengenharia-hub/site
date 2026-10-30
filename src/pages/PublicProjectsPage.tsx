import { ProjectsHero } from '../features/public/components/ProjectsHero'
import { PortfolioCatalog } from '../features/public/components/PortfolioCatalog'
import { FinalCTASection } from '../features/public/components/FinalCTASection'

export const PublicProjectsPage = () => {
    return (
        <div className="flex flex-col w-full min-h-screen bg-white">
            <ProjectsHero />
            <PortfolioCatalog />
            <FinalCTASection />
        </div>
    )
}
