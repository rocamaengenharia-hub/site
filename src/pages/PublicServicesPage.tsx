import { ServicesHero } from '../features/public/components/ServicesHero'
import { ServicesCatalog } from '../features/public/components/ServicesCatalog'
import { FinalCTASection } from '../features/public/components/FinalCTASection'

export const PublicServicesPage = () => {
    return (
        <div className="flex flex-col w-full min-h-screen bg-white">
            <ServicesHero />
            <ServicesCatalog />
            <FinalCTASection />
        </div>
    )
}
