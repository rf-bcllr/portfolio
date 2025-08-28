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
    moreOnBento: "Ver mais no Behance",
    
    // Recommendations
    recommendationsTitle: "Recomendações",
    recommendationsSubtitle: "O que colegas e clientes falam sobre meu trabalho.",
    recommendationsItems: [
      {
        quote: "Rafael é de longe o designer mais criativo com quem já trabalhei (…) ele realmente tem olhar para detalhes e acaba identificando falhas que ninguém vê. (…), é paciente com seus colegas e sempre disposto a ajudar os outros a melhorar suas habilidades (…)",
        author: "Inis Leahy - Senior Product Designer @Udemy",
      },
      {
        quote: "Rafael é minha referência de um designer dedicado e curioso. Sempre trazendo algo novo para a mesa e explorando suas próprias habilidades ao máximo, é um profissional em quem você pode confiar para entregar as melhores soluções para as necessidades do cliente.",
        author: "Esdras Lopes - Advertisement & Media Specialist",
      },
    ],
    
    competenciesTitle: "Competências",
    competencies: [
      "Design System",
      "Prototipagem",
      "Acessibilidade",
      "Design de Interação",
      "Pesquisa com usuários",
      "Colaboração com Dev",
    ],
    
    contactTitle: "Vamos conversar?",
    contactDescription: "Disponível para projetos freelance e oportunidades de trabalho.",
    backToTop: "Voltar ao topo",
    
    // Experience Page
    experienceTitle: "Experiência",
    fullExperience: "Ver Experiência Completa",
    downloadCV: "Baixar CV",
    workExperience: "Experiência Profissional",
    education: "Formação",
    languages: "Idiomas",
    tools: "Ferramentas",
    softSkills: "Habilidades Interpessoais",
    
    // Languages
    portuguese: "Português",
    english: "Inglês", 
    german: "Alemão",
    spanish: "Espanhol",
    native: "Nativo",
    advanced: "Avançado", 
    basic: "Básico",
    
    // Work Experience
    currentJob: "Atual",
    present: "Presente",
    
    // Skills
    skills: ["UX", "UI", "Design System", "Prototipagem", "IA"]
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
    moreOnBento: "See More on Behance",
    
    // Recommendations
    recommendationsTitle: "Recommendations",
    recommendationsSubtitle: "What colleagues and clients say about my work.",
    recommendationsItems: [
      {
        quote: "Rafael is by far the most creative designer I've ever worked with (…) he really has the eye for details and ends up spotting flaws no one else does. (…), he is patient with his colleagues and always willing to help others improve their own skills (…)",
        author: "Inis Leahy - Senior Product Designer @Udemy",
      },
      {
        quote: "Rafael is my reference of a dedicated and curious designer. Always bringing something new to the table and exploring his own abilities to the fullest, he is a professional you can count on to deliver the best solutions to your client’s needs.",
        author: "Esdras Lopes - Advertisement & Media Specialist",
      },
    ],

    competenciesTitle: "Skills",
    competencies: [
      "Design System",
      "Prototyping",
      "Accessibility",
      "Interaction Design",
      "User Research",
      "Collaboration with Devs",
    ],
    
    contactTitle: "Let's talk?",
    contactDescription: "Available for freelance projects and job opportunities.",
    backToTop: "Back to top",
    
    // Experience Page
    experienceTitle: "Experience",
    fullExperience: "View Full Experience",
    downloadCV: "Download CV",
    workExperience: "Work Experience", 
    education: "Education",
    languages: "Languages",
    tools: "Tools",
    softSkills: "Soft Skills",
    
    // Languages
    portuguese: "Portuguese",
    english: "English",
    german: "German", 
    spanish: "Spanish",
    native: "Native",
    advanced: "Advanced",
    basic: "Basic",
    
    // Work Experience
    currentJob: "Current",
    present: "Present",
    
    // Skills
    skills: ["UX", "UI", "Design System", "Prototyping", "AI"]
  }
};

export function useTranslations(language: "pt" | "en") {
  return translations[language];
}