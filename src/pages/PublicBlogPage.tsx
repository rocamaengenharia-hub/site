import { BlogHero } from '../features/public/components/BlogHero'
import { BlogCatalog } from '../features/blog/components/BlogCatalog'
import { FinalCTASection } from '../features/public/components/FinalCTASection'

export const PublicBlogPage = () => {
    return (
        <div className="flex flex-col w-full min-h-screen bg-white">
            <BlogHero />
            <BlogCatalog />
            <FinalCTASection />
        </div>
    )
}
