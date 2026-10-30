import { HeroSection } from '../features/public/components/HeroSection'
import { AboutSection } from '../features/public/components/AboutSection'
import { ServicesGrid } from '../features/public/components/ServicesGrid'
import { FeaturedProject } from '../features/public/components/FeaturedProject'
import { ProcessTimeline } from '../features/public/components/ProcessTimeline'
import { StatsBar } from '../features/public/components/StatsBar'
import { ProjectsPortfolioGrid } from '../features/public/components/ProjectsPortfolioGrid'
import { TestimonialsSection } from '../features/public/components/TestimonialsSection'
import { FAQSection } from '../features/public/components/FAQSection'
import { FinalCTASection } from '../features/public/components/FinalCTASection'

export const HomePage = () => {
    return (
        <div className="flex flex-col gap-0 w-full overflow-x-hidden">
            <HeroSection />
            <StatsBar />
            <ProjectsPortfolioGrid />
            <AboutSection />
            <ServicesGrid />
            <TestimonialsSection />
            <ProcessTimeline />
            <FeaturedProject />
            <FAQSection />
            <FinalCTASection />
        </div>
    )
}
