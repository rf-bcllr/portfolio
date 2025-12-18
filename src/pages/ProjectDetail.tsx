import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Users, Clock, Wrench, TrendingUp, Monitor, Lightbulb, CheckCircle, LayoutDashboard, MessageSquare, BookOpen, Search, BarChart3, Zap, PenTool, Shield, MousePointerClick, Bell, MapPin, Palette, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ContactFooter } from "@/components/ContactFooter";
import { UnderConstructionState } from "@/components/UnderConstructionState";
import { ProjectGallery } from "@/components/ProjectGallery";
import { MetricCard } from "@/components/MetricCard";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { FeatureCard } from "@/components/FeatureCard";
import { QuoteBlock } from "@/components/QuoteBlock";
import { InsightCard } from "@/components/InsightCard";
import { projectsData } from "@/data/projects";
import { structuredProjects, StructuredProjectData } from "@/data/projectsStructured";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";
import abstractHeroBg from "@/assets/project-hero-bg.png";

// Icon mapping for dynamic feature icons
const iconMap: Record<string, React.ComponentType<{
  className?: string;
}>> = {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Search,
  BarChart3,
  Zap,
  PenTool,
  Shield,
  CheckCircle,
  MousePointerClick,
  Bell,
  MapPin,
  Palette,
  Smartphone
};
const TBDBadge = () => <Badge variant="outline" className="text-xs font-normal">
    TBD
  </Badge>;
const isUnderConstruction = (text: string): boolean => {
  return text.includes("🚧") || text.includes("under construction") || text === "Page under construction";
};

// Structured project view component
const StructuredProjectView = ({
  project
}: {
  project: StructuredProjectData;
}) => {
  return <div className="space-y-16">
      {/* Challenge */}
      <AnimatedSection>
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-foreground">
          The challenge
        </h2>
        {project.challenge.hook && (
          <QuoteBlock quote={project.challenge.hook} author="" variant="highlight" />
        )}
        
        <p className="text-lg text-foreground font-medium">
          Goal: {project.challenge.goal}
        </p>
      </AnimatedSection>

      {/* Process */}
      <AnimatedSection delay={0.1}>
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-8 text-foreground">
          The process
        </h2>
        <ProcessTimeline steps={project.process.steps} />
        
        {project.process.insights && project.process.insights.length > 0 && <div className="mt-10">
            <h3 className="text-xl font-semibold text-foreground mb-4 uppercase tracking-wider">
              Key insights
            </h3>
            <div className="grid gap-3">
              {project.process.insights.map((insight, index) => <InsightCard key={index} insight={insight.text} delay={index * 0.1} />)}
            </div>
          </div>}
      </AnimatedSection>

      {/* Solution */}
      <AnimatedSection delay={0.2}>
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-foreground">
          The solution
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          {project.solution.summary}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {project.solution.features.map((feature, index) => {
          const IconComponent = iconMap[feature.icon] || BookOpen;
          return <FeatureCard key={index} icon={IconComponent} title={feature.title} description={feature.description} delay={index * 0.1} />;
        })}
        </div>
      </AnimatedSection>

      {/* Impact */}
      <AnimatedSection delay={0.3}>
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-8 text-foreground">
          The impact
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {project.impact.metrics.map((metric, index) => <MetricCard key={index} value={metric.value} label={metric.label} delay={index * 0.1} />)}
        </div>
        {project.impact.testimonial && <QuoteBlock quote={project.impact.testimonial.quote} author={project.impact.testimonial.author} role={project.impact.testimonial.role} />}
      </AnimatedSection>

      {/* Learnings */}
      {project.learnings && project.learnings.length > 0 && <AnimatedSection delay={0.4}>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-foreground">
            Learnings
          </h2>
          <ul className="space-y-3">
            {project.learnings.map((learning, index) => <motion.li key={index} initial={{
          opacity: 0,
          x: -10
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.3,
          delay: index * 0.1
        }} viewport={{
          once: true
        }} className="flex items-start gap-3 text-lg text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-foreground flex-shrink-0 mt-2.5" />
                {learning.text}
              </motion.li>)}
          </ul>
        </AnimatedSection>}

      {/* Back Button */}
      <AnimatedSection delay={0.4}>
        <Button variant="ghost" size="default" asChild>
          <Link to="/" data-cursor-action="back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </AnimatedSection>
    </div>;
};

// Legacy project view component (for projects not yet migrated)
const LegacyProjectView = ({
  project
}: {
  project: typeof projectsData[0];
}) => {
  return <div className="space-y-16">
      {/* Challenge */}
      <AnimatedSection>
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-foreground">
          The challenge
        </h2>
        {isUnderConstruction(project.challenge) ? <UnderConstructionState /> : <p className="text-lg text-muted-foreground leading-relaxed">
            {project.challenge}
          </p>}
      </AnimatedSection>

      {/* Process */}
      <AnimatedSection delay={0.1}>
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-foreground">
          The process
        </h2>
        {isUnderConstruction(project.process) ? <UnderConstructionState /> : <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
            {project.process}
          </p>}
      </AnimatedSection>

      {/* Solution */}
      <AnimatedSection delay={0.2}>
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-foreground">
          The solution
        </h2>
        {isUnderConstruction(project.solution) ? <UnderConstructionState /> : <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
            {project.solution}
          </p>}
      </AnimatedSection>

      {/* Impact */}
      <AnimatedSection delay={0.3}>
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-foreground">
          The impact
        </h2>
        {project.impact === "TBD" ? <div className="text-lg text-muted-foreground">
            <TBDBadge />
          </div> : <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
            {project.impact}
          </p>}
      </AnimatedSection>

      {/* Learnings */}
      {project.learnings && <AnimatedSection delay={0.4}>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-foreground">
            Learnings
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
            {project.learnings}
          </p>
        </AnimatedSection>}

      {/* Back Button */}
      <AnimatedSection delay={0.4}>
        <Button variant="ghost" size="default" asChild>
          <Link to="/" data-cursor-action="back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </AnimatedSection>
    </div>;
};
const ProjectDetail = () => {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const [imageError, setImageError] = useState(false);
  const project = projectsData.find(p => p.slug === slug);
  const structuredProject = slug ? structuredProjects[slug] : undefined;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  if (!project) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>;
  }

  // Use structured data if available
  const displayProject = structuredProject || project;
  return <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex items-center justify-between py-4">
          <Link to="/" data-cursor-action="home" className="flex items-center">
            <img src={avatar} alt="Rafael Bacellar avatar" className="h-8 w-8 rounded-full border border-border object-cover transition-transform duration-300" />
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
        <div className="absolute inset-0 min-h-[60vh]" style={{
        backgroundImage: `url(${abstractHeroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(8px)',
        transform: 'scale(1.1)' // Prevents blur edge artifacts
      }} />
        
        {/* Project Image Overlay - Centered (if image exists and no error) */}
        {!imageError && displayProject.heroImage && <div className="relative min-h-[60vh] flex items-center justify-center p-6 lg:p-12">
            <motion.img src={displayProject.heroImage} alt={displayProject.title} onError={() => setImageError(true)} initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.6
        }} className="max-h-[55vh] max-w-[90%] lg:max-w-[80%] object-contain rounded-2xl shadow-2xl" style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.15)'
        }} />
          </div>}
        
        {/* Fallback - Just Abstract Background (if no image or error) */}
        {(imageError || !displayProject.heroImage) && <div className="relative min-h-[60vh]" />}
        
        {/* Hero Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent p-6 lg:p-12">
          <div className="container mx-auto max-w-6xl">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }}>
              <Badge variant="secondary" className="mb-4">
                {displayProject.year} · {displayProject.company}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4">
                {displayProject.title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                {displayProject.subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="container mx-auto px-6 py-16 lg:py-24 max-w-6xl">
        {/* Check if entire project is under construction */}
        {!structuredProject && isUnderConstruction(project.challenge) && isUnderConstruction(project.process) && isUnderConstruction(project.solution) ?
      // Special handling for Cyberbrake: Gallery left, Empty State right
      project.slug === "cyberbrake" ? <div className="grid lg:grid-cols-[350px_1fr] gap-12 lg:gap-16 items-start">
        <aside className="lg:sticky lg:top-24 h-fit space-y-6">
          {/* Gallery */}
          <AnimatedSection>
            <ProjectGallery images={project.gallery || [{
              src: project.heroImage,
              title: project.title
            }]} />
          </AnimatedSection>
        </aside>
              
              <div className="flex items-center justify-center min-h-[60vh]">
                <UnderConstructionState />
              </div>
            </div> :
      // Standard empty state for other under-construction projects
      <div className="flex items-center justify-center min-h-[60vh]">
              <UnderConstructionState />
            </div> : <div className="grid lg:grid-cols-[350px_1fr] gap-12 lg:gap-16 items-start">
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
                    <div className="flex items-center gap-2 mb-2 text-foreground">
                      <Users className="w-4 h-4" />
                      <h3 className="font-semibold text-sm">Role</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{displayProject.overview.role}</p>
                  </div>

                  {/* My Contributions */}
                  {displayProject.overview.myContributions && displayProject.overview.myContributions.length > 0 && <div>
                      <div className="flex items-center gap-2 mb-2 text-foreground">
                        <CheckCircle className="w-4 h-4" />
                        <h3 className="font-semibold text-sm">My Contributions</h3>
                      </div>
                      <ul className="space-y-1.5">
                        {displayProject.overview.myContributions.map((contribution, index) => <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-foreground flex-shrink-0 mt-2" />
                            {contribution}
                          </li>)}
                      </ul>
                    </div>}

                  {/* Team */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-foreground">
                      <Users className="w-4 h-4" />
                      <h3 className="font-semibold text-sm">Team</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {displayProject.overview.team === "TBD" ? <TBDBadge /> : displayProject.overview.team}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-foreground">
                      <Clock className="w-4 h-4" />
                      <h3 className="font-semibold text-sm">Duration</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {displayProject.overview.duration === "TBD" ? <TBDBadge /> : displayProject.overview.duration}
                    </div>
                  </div>

                  {/* Platform */}
                  {displayProject.overview.platform && <div>
                      <div className="flex items-center gap-2 mb-2 text-foreground">
                        <Monitor className="w-4 h-4" />
                        <h3 className="font-semibold text-sm">Platform</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{displayProject.overview.platform}</p>
                    </div>}

                  {/* Tools */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-foreground">
                      <Wrench className="w-4 h-4" />
                      <h3 className="font-semibold text-sm">Tools Used</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {displayProject.overview.tools[0] === "TBD" ? <TBDBadge /> : displayProject.overview.tools.map(tool => <Badge key={tool} variant="outline" className="text-xs">
                            {tool}
                          </Badge>)}
                    </div>
                  </div>

                  {/* Impact Metrics */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <h3 className="font-semibold text-sm">Key Impact</h3>
                    </div>
                    <ul className="space-y-2">
                      {displayProject.overview.impact[0] === "TBD" || isUnderConstruction(displayProject.overview.impact[0]) ? <li className="text-sm text-muted-foreground">
                          <TBDBadge />
                        </li> : displayProject.overview.impact.map((metric, index) => <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0 mt-1.5" />
                            {metric}
                          </li>)}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Gallery Section */}
            <AnimatedSection delay={0.1}>
              <ProjectGallery images={displayProject.gallery || [{
              src: displayProject.heroImage,
              title: displayProject.title
            }]} />
            </AnimatedSection>
          </aside>

          {/* Main Content - Use structured or legacy view */}
          {structuredProject ? <StructuredProjectView project={structuredProject} /> : <LegacyProjectView project={project} />}
        </div>}
      </section>

      <ContactFooter />
    </div>;
};
export default ProjectDetail;