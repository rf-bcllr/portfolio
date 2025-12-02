import meuArcoOgCover from "@/assets/meu-arco/og-cover.png";

// New structured data format for visual case studies
export interface StructuredChallenge {
  hook: string;
  context: string;
  goal: string;
}

export interface ProcessStep {
  title: string;
  duration?: string;
  description?: string;
}

export interface KeyInsight {
  text: string;
}

export interface StructuredProcess {
  steps: ProcessStep[];
  insights?: KeyInsight[];
}

export interface SolutionFeature {
  icon: string; // Icon name from lucide-react
  title: string;
  description: string;
}

export interface StructuredSolution {
  summary: string;
  features: SolutionFeature[];
}

export interface ImpactMetric {
  value: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface StructuredImpact {
  metrics: ImpactMetric[];
  testimonial?: Testimonial;
}

export interface LearningItem {
  text: string;
}

export interface StructuredProjectData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  year: number;
  company: string;
  heroImage: string;
  coverType: "horizontal" | "vertical";
  overview: {
    role: string;
    myContributions?: string[];
    team: string;
    duration: string;
    platform?: string;
    tools: string[];
    impact: string[];
  };
  challenge: StructuredChallenge;
  process: StructuredProcess;
  solution: StructuredSolution;
  impact: StructuredImpact;
  learnings?: LearningItem[];
  gallery?: {
    src: string;
    title: string;
  }[];
}

// Structured data for Meu Arco project
export const meuArcoStructured: StructuredProjectData = {
  id: "meu-arco",
  slug: "meu-arco",
  title: "Meu Arco",
  subtitle: "Educational platform for Arco Educação ecosystem",
  year: 2024,
  company: "isaac (Arco Educação)",
  heroImage: "https://storage.googleapis.com/creatorspace-public/users%2Fclnkcjnw802u4ou01tta5rqcm%2FUKVcVl4DB6Bzva11-ScreenRecording2024-11-19at08.19.59-ezgif.com-crop.gif",
  coverType: "horizontal",
  overview: {
    role: "Product Designer",
    myContributions: [
      "Led end-to-end design from research to handoff",
      "Conducted research with 25+ schools (150+ hours)",
      "Created design system (40+ components)",
      "Facilitated 8 workshops with stakeholders",
      "Delivered 120+ screens and 50+ prototypes"
    ],
    team: "PM, 3 Frontend, 2 Backend Engineers",
    duration: "16 weeks",
    platform: "Web & Mobile",
    tools: ["Figma", "FigJam", "Miro", "React"],
    impact: [
      "10K+ active users",
      "85% daily active rate",
      "4.6/5 satisfaction",
      "45% fewer tickets"
    ]
  },
  gallery: [
    { 
      src: "https://storage.googleapis.com/creatorspace-public/users%2Fclnkcjnw802u4ou01tta5rqcm%2FUKVcVl4DB6Bzva11-ScreenRecording2024-11-19at08.19.59-ezgif.com-crop.gif", 
      title: "Meu Arco Platform Demo" 
    },
    { src: meuArcoOgCover, title: "Meu Arco Overview" }
  ],
  challenge: {
    hook: "A teacher opens 3 tabs every morning just to check homework.",
    context: "Arco's fragmented ecosystem (isaac, São Paulo Sistema, Positivo) left teachers wasting 20+ minutes daily switching platforms. 45% of support tickets were 'I can't find where to...'",
    goal: "Unify the experience without killing brand identities."
  },
  process: {
    steps: [
      { title: "Research", duration: "4 weeks", description: "25+ schools, 150+ hours observation" },
      { title: "Design", duration: "8 weeks", description: "40+ components, 200+ variants" },
      { title: "Testing", duration: "2 weeks", description: "45+ participants, 6 rounds" },
      { title: "Launch", duration: "2 weeks", description: "Phased rollout to 10K+ users" }
    ],
    insights: [
      { text: "Users wanted ONE login, not five credentials" },
      { text: "Brand loyalty was emotional—we couldn't erase identities" },
      { text: "Teachers lost 20+ min daily switching platforms" }
    ]
  },
  solution: {
    summary: "Meu Arco became the unified gateway with role-aware intelligence and brand-aware theming.",
    features: [
      {
        icon: "LayoutDashboard",
        title: "Smart Dashboard",
        description: "Role-aware interface: teachers see lessons, students see assignments, admins see analytics."
      },
      {
        icon: "MessageSquare",
        title: "Unified Messaging",
        description: "Connect all stakeholders with contextual messaging across all Arco brands."
      },
      {
        icon: "BookOpen",
        title: "Resource Library",
        description: "Smart search across previously siloed content with personalized recommendations."
      }
    ]
  },
  impact: {
    metrics: [
      { value: "10K+", label: "Active Users" },
      { value: "85%", label: "Daily Active" },
      { value: "45%", label: "Fewer Tickets" },
      { value: "4.6/5", label: "Satisfaction" }
    ],
    testimonial: {
      quote: "Finally, a platform that makes sense! I used to waste so much time figuring out where to click.",
      author: "Maria Santos",
      role: "Teacher, Colégio São Paulo"
    }
  },
  learnings: [
    { text: "Unity requires more than visual consistency—it's about mental models" },
    { text: "Design systems are political, not just technical" },
    { text: "Ethnographic research reveals what interviews never would" },
    { text: "Engineering partnership from day 1 prevented expensive rework" }
  ]
};

// Map of structured projects by slug
export const structuredProjects: Record<string, StructuredProjectData> = {
  "meu-arco": meuArcoStructured
};
