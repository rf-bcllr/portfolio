import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Users, Clock, Wrench, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ContactFooter } from "@/components/ContactFooter";
import { UnderConstructionState } from "@/components/UnderConstructionState";
import { ProjectGallery } from "@/components/ProjectGallery";
import { OrganicBackground } from "@/components/OrganicBackground";
import { projectsData } from "@/data/projects";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";
import abstractHeroBg from "@/assets/project-hero-bg.png";

const TBDBadge = () => (
  <Badge variant="outline" className="text-xs font-normal">
    TBD
  </Badge>
);

const isUnderConstruction = (text: string): boolean => {
  return text.includes("🚧") || text.includes("under construction") || text === "Page under construction";
};

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [imageError, setImageError] = useState(false);
  
  const project = projectsData.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <OrganicBackground variant="section" />
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex items-center justify-between py-4">
          <Link to="/" data-cursor-action="home" className="flex items-center">
            <img 
              src={avatar} 
              alt="Rafael Bacellar avatar" 
              className="h-8 w-8 rounded-full border border-border object-cover transition-transform duration-300" 
            />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="contrast" size="sm">
              <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </Button>
          </div>
        </nav>
      </header>


      {/* Hero Section - Unified Design with Abstract Background */}
      <section className="relative overflow-hidden">
        {/* Abstract Background Layer - Always Present */}
        <div 
          className="absolute inset-0 min-h-[60vh]"
          style={{ 
            backgroundImage: `url(${abstractHeroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            transform: 'scale(1.1)' // Prevents blur edge artifacts
          }}
        />
        
        {/* Project Image Overlay - Centered (if image exists and no error) */}
        {!imageError && project.heroImage && (
          <div className="relative min-h-[60vh] flex items-center justify-center p-6 lg:p-12">
            <motion.img 
              src={project.heroImage} 
              alt={project.title}
              onError={() => setImageError(true)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-h-[55vh] max-w-[90%] lg:max-w-[80%] object-contain rounded-2xl shadow-2xl"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.15)'
              }}
            />
          </div>
        )}
        
        {/* Fallback - Just Abstract Background (if no image or error) */}
        {(imageError || !project.heroImage) && (
          <div className="relative min-h-[60vh]" />
        )}
        
        {/* Hero Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent p-6 lg:p-12">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-4">
                {project.year} · {project.company}
              </Badge>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-display mb-4">
                {project.title}
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl">
                {project.subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="container mx-auto px-6 py-16 lg:py-24 max-w-6xl">
        {/* Check if entire project is under construction */}
        {isUnderConstruction(project.challenge) && 
         isUnderConstruction(project.process) && 
         isUnderConstruction(project.solution) ? (
          
          // Special handling for Cyberbrake: Gallery left, Empty State right
          project.slug === "cyberbrake" ? (
      <div className="grid lg:grid-cols-[350px_1fr] gap-12 lg:gap-16 items-start">
        <aside className="lg:sticky lg:top-24 h-fit space-y-6">
          {/* Gallery */}
          <AnimatedSection>
            <ProjectGallery 
              images={
                project.gallery || [
                  { src: project.heroImage, title: project.title }
                ]
              }
            />
          </AnimatedSection>
        </aside>
              
              <div className="flex items-center justify-center min-h-[60vh]">
                <UnderConstructionState />
              </div>
            </div>
          ) : (
            // Standard empty state for other under-construction projects
            <div className="flex items-center justify-center min-h-[60vh]">
              <UnderConstructionState />
            </div>
          )
        ) : (
        <div className="grid lg:grid-cols-[350px_1fr] gap-12 lg:gap-16 items-start">
          {/* Sidebar - Overview Card (Sticky on desktop) */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-6">
            <AnimatedSection>
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-display">Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Role */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <Users className="w-4 h-4" />
                      <h3 className="font-semibold text-sm">Role</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.overview.role}</p>
                  </div>

                  {/* Team */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <Users className="w-4 h-4" />
                      <h3 className="font-semibold text-sm">Team</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {project.overview.team === "TBD" ? <TBDBadge /> : project.overview.team}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <Clock className="w-4 h-4" />
                      <h3 className="font-semibold text-sm">Duration</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {project.overview.duration === "TBD" ? <TBDBadge /> : project.overview.duration}
                    </div>
                  </div>

                  {/* Tools */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-primary">
                      <Wrench className="w-4 h-4" />
                      <h3 className="font-semibold text-sm">Tools Used</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.overview.tools[0] === "TBD" ? (
                        <TBDBadge />
                      ) : (
                        project.overview.tools.map((tool) => (
                          <Badge key={tool} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Impact Metrics */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-primary">
                      <TrendingUp className="w-4 h-4" />
                      <h3 className="font-semibold text-sm">Key Impact</h3>
                    </div>
                    <ul className="space-y-2">
                      {project.overview.impact[0] === "TBD" || isUnderConstruction(project.overview.impact[0]) ? (
                        <li className="text-sm text-muted-foreground">
                          <TBDBadge />
                        </li>
                      ) : (
                        project.overview.impact.map((metric, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                            {metric}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Gallery Section */}
            <AnimatedSection delay={0.1}>
              <ProjectGallery 
                images={
                  project.gallery || [
                    { src: project.heroImage, title: project.title }
                  ]
                }
              />
            </AnimatedSection>
          </aside>

          {/* Main Content */}
          <div className="space-y-16">
            {/* Challenge */}
            <AnimatedSection>
              <h2 className="text-3xl lg:text-4xl font-bold font-display mb-6 text-primary">
                The Challenge
              </h2>
              {isUnderConstruction(project.challenge) ? (
                <UnderConstructionState />
              ) : (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.challenge}
                </p>
              )}
            </AnimatedSection>

            {/* Process */}
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl lg:text-4xl font-bold font-display mb-6 text-primary">
                The Process
              </h2>
              {isUnderConstruction(project.process) ? (
                <UnderConstructionState />
              ) : (
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {project.process}
                </p>
              )}
            </AnimatedSection>

            {/* Solution */}
            <AnimatedSection delay={0.2}>
              <h2 className="text-3xl lg:text-4xl font-bold font-display mb-6 text-primary">
                The Solution
              </h2>
              {isUnderConstruction(project.solution) ? (
                <UnderConstructionState />
              ) : (
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {project.solution}
                </p>
              )}
            </AnimatedSection>

            {/* Impact */}
            <AnimatedSection delay={0.3}>
              <h2 className="text-3xl lg:text-4xl font-bold font-display mb-6 text-primary">
                The Impact
              </h2>
              {project.impact === "TBD" ? (
                <div className="text-lg text-muted-foreground">
                  <TBDBadge />
                </div>
              ) : (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.impact}
                </p>
              )}
            </AnimatedSection>

            {/* Back Button */}
            <AnimatedSection delay={0.4}>
              <Button variant="ghost" size="default" asChild>
                <Link to="/" data-cursor-action="back">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
            </AnimatedSection>

          </div>
        </div>
        )}
      </section>

      <ContactFooter />
    </div>
  );
};

export default ProjectDetail;
