import { AboutHero } from '../features/public/components/AboutHero'
import { AboutStory } from '../features/public/components/AboutStory'
import { TechnicalPhilosophy } from '../features/public/components/TechnicalPhilosophy'
import { StatsBar } from '../features/public/components/StatsBar'
import { FinalCTASection } from '../features/public/components/FinalCTASection'

export const AboutPage = () => {
    return (
        <div className="flex flex-col w-full min-h-screen bg-white">
            <AboutHero />
            <StatsBar />
            <AboutStory />
            <TechnicalPhilosophy />
            <FinalCTASection />
        </div>
    )
}
