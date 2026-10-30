import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { HomePageEditor } from "./HomePageEditor"
import { HomeStatsEditor } from "./HomeStatsEditor"
import { HomeAboutEditor } from "./HomeAboutEditor"
import { HomeTestimonialsEditor } from "./HomeTestimonialsEditor"
import { HomeProcessEditor } from "./HomeProcessEditor"
import { HomeFAQEditor } from "./HomeFAQEditor"
import { HomeCTAEditor } from "./HomeCTAEditor"
import { ServicesPageEditor } from "./ServicesPageEditor"
import { PortfolioPageEditor } from "./PortfolioPageEditor"
import { AboutPageEditor } from "./AboutPageEditor"
import { BlogPageEditor } from "./BlogPageEditor"
import { ContactPageEditor } from "./ContactPageEditor"

export const SiteEditorPage = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Editor do Site</h1>
                <p className="text-muted-foreground">
                    Gerencie o conteúdo das páginas públicas do site.
                </p>
            </div>

            <Tabs defaultValue="home" className="space-y-4">
                <TabsList className="flex flex-wrap h-auto gap-1">
                    <TabsTrigger value="home">Home</TabsTrigger>
                    <TabsTrigger value="services">Serviços</TabsTrigger>
                    <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
                    <TabsTrigger value="about">Sobre Nós</TabsTrigger>
                    <TabsTrigger value="blog">Blog</TabsTrigger>
                    <TabsTrigger value="contact">Contato</TabsTrigger>
                </TabsList>

                <TabsContent value="home" className="space-y-8">
                    <HomePageEditor />
                    <HomeStatsEditor />
                    <HomeAboutEditor />
                    <HomeTestimonialsEditor />
                    <HomeProcessEditor />
                    <HomeFAQEditor />
                    <HomeCTAEditor />
                </TabsContent>

                <TabsContent value="services" className="space-y-8">
                    <ServicesPageEditor />
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-8">
                    <PortfolioPageEditor />
                </TabsContent>

                <TabsContent value="about" className="space-y-8">
                    <AboutPageEditor />
                </TabsContent>

                <TabsContent value="blog" className="space-y-8">
                    <BlogPageEditor />
                </TabsContent>

                <TabsContent value="contact" className="space-y-8">
                    <ContactPageEditor />
                </TabsContent>
            </Tabs>
        </div>
    )
}
