export const translations = {
  pt: {
    // Navigation
    projects: "Projetos",
    about: "Sobre", 
    contact: "Contato",
    
    // Hero Section
    heroTitle: "Rafael Bacellar — Product Designer",
    heroDescription: "Portfólio com experiências reais em produtos digitais. Foco em UX/UI, design system e interfaces escaláveis.",
    talkOnLinkedIn: "Falar no LinkedIn",
    viewProjects: "Ver projetos",
    
    // Projects Section
    realExperiences: "Experiências reais",
    projectsSubtitle: "Alguns destaques visuais dos meus estudos de caso.",
    
    // About Section
    aboutTitle: "Sobre mim",
    aboutDescription: "Product Designer com 8+ anos de experiência criando produtos digitais que conectam pessoas e resolvem problemas reais.",
    
    // Certifications
    certificationsTitle: "Certificações",
    certificationsSubtitle: "Principais certificações e cursos concluídos.",
    
    // Recommendations
    recommendationsTitle: "Recomendações",
    recommendationsSubtitle: "O que colegas e clientes falam sobre meu trabalho.",
    
    // Contact
    contactTitle: "Vamos conversar?",
    contactDescription: "Disponível para projetos freelance e oportunidades de trabalho.",
    
    // Skills
    skills: ["UX", "UI", "Design System", "Prototipagem"]
  },
  en: {
    // Navigation
    projects: "Projects",
    about: "About",
    contact: "Contact",
    
    // Hero Section
    heroTitle: "Rafael Bacellar — Product Designer",
    heroDescription: "Portfolio with real experiences in digital products. Focus on UX/UI, design systems and scalable interfaces.",
    talkOnLinkedIn: "Talk on LinkedIn",
    viewProjects: "View projects",
    
    // Projects Section
    realExperiences: "Real experiences",
    projectsSubtitle: "Some visual highlights from my case studies.",
    
    // About Section
    aboutTitle: "About me",
    aboutDescription: "Product Designer with 8+ years of experience creating digital products that connect people and solve real problems.",
    
    // Certifications
    certificationsTitle: "Certifications",
    certificationsSubtitle: "Main certifications and completed courses.",
    
    // Recommendations
    recommendationsTitle: "Recommendations",
    recommendationsSubtitle: "What colleagues and clients say about my work.",
    
    // Contact
    contactTitle: "Let's talk?",
    contactDescription: "Available for freelance projects and job opportunities.",
    
    // Skills
    skills: ["UX", "UI", "Design System", "Prototyping"]
  }
};

export function useTranslations(language: "pt" | "en") {
  return translations[language];
}