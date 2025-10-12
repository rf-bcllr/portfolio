export const translations = {
  en: {
    // Navigation
    projects: "Projects",
    about: "About",
    contact: "Contact",
    
    // Hero Section
    heroGreeting: "Hi, my name is Rafa Bacellar 👋🏿",
    heroDescription: "Brazilian product designer with real experiences in digital products. Focus on UX/UI, design system and scalable interfaces.",
    talkOnLinkedIn: "Talk on LinkedIn",
    viewProjects: "View projects",
    
    // Companies Section
    companiesTitle: "I've worked with",
    companiesSubtitle: "Some of the companies where I've applied my skills in digital product design.",
    
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
        author: "Inis Leahy",
        role: "Senior Product Designer @Udemy",
        description: "(former Meta employee)",
        linkedin: "https://www.linkedin.com/in/inisleahy/"
      },
      {
        quote: "Rafael is my reference of a dedicated and curious designer. Always bringing something new to the table and exploring his own abilities to the fullest, he is a professional you can count on to deliver the best solutions to your client's needs.",
        author: "Esdras Lopes",
        role: "Advertisement & Media Specialist",
        linkedin: "https://www.linkedin.com/in/esdraslopesb/"
      },
    ],

    powerSkillsTitle: "My Power Skills",
    powerSkills: [
      { emoji: "💬", text: "Communication" },
      { emoji: "🧠", text: "Problem-solving" },
      { emoji: "🧭", text: "Product sense" },
      { emoji: "🛠️", text: "Prototyping" },
      { emoji: "🤝🏿", text: "Collaboration with Devs" },
      { emoji: "⚡", text: "Fast Iterations" },
      { emoji: "📖", text: "Storytelling" },
    ],
    
    hobbiesTitle: "Hobbies and things I love",
    hobbies: [
      { emoji: "✍️", text: "Creative Writing" },
      { emoji: "🎨", text: "Visual Design" },
      { emoji: "🤖", text: "AI" },
      { emoji: "🐶", text: "Dogs" },
      { emoji: "🎮", text: "Gaming" },
      { emoji: "📚", text: "History" },
      { emoji: "☕", text: "Coffee" },
    ],
    
    contactTitle: "Let's talk?",
    contactDescription: "Available for freelance projects and job opportunities.",
    backToTop: "Back to top",
    
    // Design Process
    designProcessTitle: "My Design Process",
    designProcessIntro: "User experience design is much more than what meets the eye. I collaborate with my team on all aspects of a user's interaction with a company and its products.",
    designProcessStrategize: {
      title: "Strategize",
      description: "Explore the problem as deeply as possible. Understand the needs of the users and business, the context and the competition."
    },
    designProcessIterate: {
      title: "Iterate",
      description: "Generate as many ideas as possible. Do not be afraid to experiment and try out new ideas. I may use AI to generate quick prototypes. Sketch, create wireframes, build prototypes."
    },
    designProcessLaunch: {
      title: "Launch",
      description: "Test feasibility of the product and get feedback from users. Be prepared to make changes to the product based on the feedback."
    },
    designProcessMeasure: {
      title: "Measure",
      description: "The design process is never really finished. Use metrics and data to iterate and improve the product and its performance."
    },
    
    // Experience Page
    experienceTitle: "Experience",
    fullExperience: "Check my full resume",
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

export function useTranslations() {
  return translations.en;
}
