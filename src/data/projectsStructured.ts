import meuArcoOgCover from "@/assets/meu-arco/og-cover.png";
import meuArcoDemo from "@/assets/meu-arco-demo-poster.jpg";
import projHealthyNew from "@/assets/proj-healthy-new.png";
import projMuralNew from "@/assets/proj-mural-new.png";
import projThumbNew3 from "@/assets/proj-thumb-new-3.png";
import projectThumbNew1 from "@/assets/project-thumb-new-1.jpg";
import projectThumbNew2 from "@/assets/project-thumb-new-2.jpg";
import aiWritingAssistant from "@/assets/ai-writing-assistant-poster.jpg";
import chegueiMobilePoster from "@/assets/cheguei-mobile-poster.jpg";
import chegueiMobileMp4 from "@/assets/cheguei-mobile.mp4";
import aiCommsDashboardMp4 from "@/assets/ai-comms-dashboard.mp4";

// New structured data format for visual case studies
export interface StructuredChallenge {
  hook?: string;
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

// =====================================================
// MEU ARCO - Data from rfbcllr-showcase.lovable.app
// =====================================================
export const meuArcoStructured: StructuredProjectData = {
  id: "meu-arco",
  slug: "meu-arco",
  title: "Meu Arco",
  subtitle: "From Two Products to One Unified Experience",
  year: 2024,
  company: "isaac (Arco Educação)",
  heroImage: meuArcoDemo,
  coverType: "horizontal",
  overview: {
    role: "Product Designer",
    myContributions: [
      "Led end-to-end design from research to handoff",
      "Conducted user research with 16 interviews",
      "Created Gravity design system (unified Edna + Radix)",
      "Ran tree testing with 3 structure variations",
      "Conducted 2 usability test rounds with 10 participants"
    ],
    team: "PM, 3 Frontend, 2 Backend Engineers",
    duration: "16 weeks",
    platform: "Web & Mobile",
    tools: ["Figma", "FigJam", "Miro", "Optimal Workshop"],
    impact: [
      "SUS Score: 90 (Exceptional)",
      "App rating: 2.9 → 4.8★",
      "100% rollout ahead of schedule",
      "35% fewer support tickets"
    ]
  },
  gallery: [
    { 
      src: meuArcoDemo, 
      title: "Meu Arco Platform Demo" 
    },
    { src: meuArcoOgCover, title: "Meu Arco Overview" }
  ],
  challenge: {
    hook: "Two standalone apps serving overlapping needs. One problem: users juggling both.",
    context: "ClassApp handled communication. Meu Isaac handled finance. Parents, schools, and admins were forced to use both—with separate logins and inconsistent design languages (Edna vs. Radix).",
    goal: "Merge them into one cohesive, scalable product."
  },
  process: {
    steps: [
      { title: "Research", duration: "4 weeks", description: "200+ features assessed, 16 interviews, 3 personas" },
      { title: "Information Architecture", duration: "3 weeks", description: "Tree testing with 3 structures" },
      { title: "Design System", duration: "4 weeks", description: "Unified Edna + Radix into Gravity" },
      { title: "Testing", duration: "3 weeks", description: "2 rounds, 10 participants, SUS 83% → 93%" }
    ],
    insights: [
      { text: "Tree C won with 84% success rate (29% improvement over alternatives)" },
      { text: "Home-centric layout overwhelmed users; modular navigation felt 'natural'" },
      { text: "Gravity reduced design-dev handoff time by 40%" }
    ]
  },
  solution: {
    summary: "Meu Arco became a unified app with modular architecture, single design system (Gravity), and streamlined user experience.",
    features: [
      {
        icon: "LayoutDashboard",
        title: "Modular Navigation",
        description: "Finance, Communication, Settings as separate modules instead of one dense Home feed."
      },
      {
        icon: "Palette",
        title: "Gravity Design System",
        description: "Unified system replacing Edna + Radix, enabling cross-squad adoption in 3 months."
      },
      {
        icon: "Smartphone",
        title: "Unified Experience",
        description: "Single app with one login, modular architecture, streamlined user experience."
      }
    ]
  },
  impact: {
    metrics: [
      { value: "90", label: "SUS Score" },
      { value: "4.8★", label: "App Rating" },
      { value: "100%", label: "Rollout Ahead" },
      { value: "35%", label: "Fewer Tickets" }
    ],
    testimonial: {
      quote: "I love that everything is in one place now. I don't have to switch between apps.",
      author: "User from testing"
    }
  },
  learnings: [
    { text: "Modular three-category structure outperformed single-hierarchy by 29%" },
    { text: "Redesigning Home from content-heavy to showcase gateway improved SUS by 10+ points" },
    { text: "Gravity enabled cross-squad adoption within 3 months" }
  ]
};

// =====================================================
// SAÚDE E PONTO - Healthy Food Delivery
// =====================================================
export const saudeEPontoStructured: StructuredProjectData = {
  id: "health-food-delivery",
  slug: "health-food-delivery",
  title: "Saúde e Ponto",
  subtitle: "Healthy food delivery app for busy professionals",
  year: 2023,
  company: "Personal Project",
  heroImage: projHealthyNew,
  coverType: "vertical",
  overview: {
    role: "Product Designer & Researcher",
    myContributions: [
      "Conducted 18 user interviews and competitive analysis of 8 apps",
      "Created user personas and journey maps for 4 dietary profiles",
      "Designed complete UI/UX from wireframes to high-fidelity prototypes",
      "Conducted usability testing with 15 participants"
    ],
    team: "Solo project (design & research)",
    duration: "8 weeks",
    platform: "Mobile (iOS & Android)",
    tools: ["Figma", "FigJam", "Adobe Illustrator", "Photoshop"],
    impact: [
      "92% task completion rate",
      "8.7/10 user satisfaction",
      "35% faster checkout than competitors",
      "Featured on Behance with 2,500+ views"
    ]
  },
  gallery: [
    { src: projHealthyNew, title: "Home Screen & Order Flow" },
    { src: projThumbNew3, title: "Product Details & Checkout" }
  ],
  challenge: {
    hook: "After 15 minutes of indecision and three abandoned carts, she orders pizza. Again.",
    context: "Busy professionals wanted to eat healthy, but existing apps made it exhausting. Too many choices, hidden nutritional information, complex checkout flows with upsells at every step.",
    goal: "Create a health-first food delivery experience that's as fast and appealing as mainstream competitors."
  },
  process: {
    steps: [
      { title: "Research", duration: "3 weeks", description: "18 interviews, 8 competitor apps analyzed" },
      { title: "Design", duration: "4 weeks", description: "4 navigation structures tested, 3 visual iterations" },
      { title: "Testing", duration: "1 week", description: "15 participants, 92% completion rate" }
    ],
    insights: [
      { text: "78% of users abandoned checkout when presented with >5 steps" },
      { text: "Users trusted apps that showed calories BEFORE adding to cart" },
      { text: "'Healthy' imagery (green colors) actually decreased appetite appeal for 65% of users" }
    ]
  },
  solution: {
    summary: "A nutrition-first app with 3-step checkout, transparent nutritional info, and appetite-appealing visuals.",
    features: [
      {
        icon: "Search",
        title: "Smart Meal Discovery",
        description: "Time-of-day awareness, personalized recommendations, one-tap reordering."
      },
      {
        icon: "BarChart3",
        title: "Nutrition-First Display",
        description: "Clear nutritional badges visible on every meal card—no digging required."
      },
      {
        icon: "Zap",
        title: "Three-Step Checkout",
        description: "Select meal → Choose delivery time → Confirm payment. No upsells, no dark patterns."
      }
    ]
  },
  impact: {
    metrics: [
      { value: "92%", label: "Task Completion" },
      { value: "8.7/10", label: "Satisfaction" },
      { value: "35%", label: "Faster Checkout" },
      { value: "2.5K+", label: "Behance Views" }
    ]
  },
  learnings: [
    { text: "'Healthy' doesn't have to look boring—warm colors increased desire while fresh accents maintained health perception" },
    { text: "Information design is about hierarchy, not completeness—show essential info upfront" },
    { text: "Simplicity beats features—users wanted LESS choice, not more ways to filter" }
  ]
};

// =====================================================
// DIGITAL SIGNATURE
// =====================================================
export const digitalSignatureStructured: StructuredProjectData = {
  id: "digital-signature",
  slug: "digital-signature",
  title: "Digital Signature Feature",
  subtitle: "Streamlined digital enrollment for ClassApp",
  year: 2022,
  company: "ClassApp",
  heroImage: projectThumbNew1,
  coverType: "horizontal",
  overview: {
    role: "Product Designer",
    myContributions: [
      "Led discovery research with 15 school admins and 25 parents",
      "Designed complete signature capture flow and trust-building elements",
      "Conducted 3 rounds of usability testing with 35+ participants",
      "Collaborated with legal team for ICP-Brasil compliance"
    ],
    team: "PM, 2 Frontend, 1 Backend Engineers, Legal Advisor",
    duration: "12 weeks",
    platform: "Web & Mobile",
    tools: ["Figma", "Miro", "React", "Design System"],
    impact: [
      "78% reduction in enrollment time",
      "95% digital signature adoption",
      "60% decrease in support tickets",
      "15% increase in ClassApp renewals"
    ]
  },
  gallery: [
    { src: projectThumbNew1, title: "Digital Signature Flow" }
  ],
  challenge: {
    hook: "She'll have to take time off work, drive 40 minutes through São Paulo traffic, just to sign three pieces of paper.",
    context: "Parents visited schools 2-3 times to complete enrollment. Schools had rooms full of filing cabinets. Administrators spent 20+ hours weekly managing paper. Parents' #1 concern: 'Is a digital signature legally valid?'",
    goal: "Design a legally compliant digital signature that builds trust and integrates seamlessly with existing workflow."
  },
  process: {
    steps: [
      { title: "Research", duration: "3 weeks", description: "15 admin + 25 parent interviews, 8 enrollment observations" },
      { title: "Legal Deep-Dive", duration: "2 weeks", description: "ICP-Brasil compliance, signature types analysis" },
      { title: "Design & Testing", duration: "5 weeks", description: "3 rounds with 35+ participants" },
      { title: "Implementation", duration: "2 weeks", description: "Touch event optimization, signature canvas" }
    ],
    insights: [
      { text: "Parents' #1 concern was 'Is this legally valid?' not 'Can I draw my signature?'" },
      { text: "68% of users used 'Clear' button on first signature attempt—preview + redo = confidence" },
      { text: "Drawn signature (finger/stylus) won over typed or uploaded options" }
    ]
  },
  solution: {
    summary: "A trust-building digital signature experience with drawn signature capture, visible security indicators, and instant confirmation.",
    features: [
      {
        icon: "PenTool",
        title: "Drawn Signature",
        description: "Users draw signature with finger/stylus. Matches mental model of 'signing'."
      },
      {
        icon: "Shield",
        title: "Trust Signals",
        description: "Lock icons, 'Encrypted and secure' messaging, verification codes throughout."
      },
      {
        icon: "CheckCircle",
        title: "Instant Confirmation",
        description: "Success animation, downloadable PDF, email confirmation, unique verification code."
      }
    ]
  },
  impact: {
    metrics: [
      { value: "78%", label: "Time Reduction" },
      { value: "<1 d", label: "Enrollment Time" },
      { value: "95%", label: "Adoption Rate" },
      { value: "60%", label: "Fewer Tickets" }
    ]
  },
  learnings: [
    { text: "Trust is designed, not assumed—solve the emotional job, not just the functional job" },
    { text: "Legal requirements can be design opportunities—constraints reveal better solutions" },
    { text: "Test with low digital literacy users first—they reveal the real usability issues" }
  ]
};

// =====================================================
// STUDENTS TRANSPORTATION - Cheguei
// =====================================================
export const studentsTransportationStructured: StructuredProjectData = {
  id: "students-transportation",
  slug: "students-transportation",
  title: "Cheguei",
  subtitle: "Safety tracking system for school transportation",
  year: 2023,
  company: "ClassApp",
  heroImage: chegueiMobilePoster,
  coverType: "horizontal",
  overview: {
    role: "Product Designer",
    myContributions: [
      "Interviewed 20 parents and 10 drivers about safety concerns",
      "Designed multi-stakeholder system (parent app, driver app, admin dashboard)",
      "Created notification strategy balancing information with privacy"
    ],
    team: "PM, 3 Engineers, Safety Consultant",
    duration: "14 weeks",
    platform: "Mobile (iOS & Android)",
    tools: ["Figma", "FigJam", "React Native", "Design System"],
    impact: [
      "12,000+ students in first semester",
      "97% parent satisfaction",
      "85% reduction in parent calls",
      "94% driver ease-of-use rating"
    ]
  },
  gallery: [
    { src: chegueiMobileMp4, title: "Cheguei mobile experience" },
    { src: chegueiMobilePoster, title: "Cheguei – mobile preview" }
  ],
  challenge: {
    context: "Parents had no visibility into pickup times, no confirmation their child boarded, no way to track vehicles. Schools fielded 30+ calls/day. Drivers were expected to answer phones mid-drive.",
    goal: "Design a safety-focused tracking system that gives parents peace of mind without compromising driver safety."
  },
  process: {
    steps: [
      { title: "Ethnographic Research", duration: "4 weeks", description: "20+ hours on schools, 30 interviews" },
      { title: "Stakeholder Mapping", duration: "2 weeks", description: "3 parallel journeys: parent, driver, admin" },
      { title: "Design & Testing", duration: "6 weeks", description: "4 check-in methods tested, 3 usability rounds" },
      { title: "Pilot", duration: "2 weeks", description: "3 schools, 200 students, 97% satisfaction" }
    ],
    insights: [
      { text: "Drivers had ZERO seconds of attention to spare—every interaction had to be instantaneous" },
      { text: "One-tap method won among 4 check-in alternatives tested" },
      { text: "Parents wanted proactive notifications, not reactive info-seeking" }
    ]
  },
  solution: {
    summary: "A multi-stakeholder system with one-tap driver check-in, proactive parent notifications, and real-time admin dashboard.",
    features: [
      {
        icon: "MousePointerClick",
        title: "One-Tap Check-in",
        description: "Driver taps student name once. Minimal distraction, maximum safety."
      },
      {
        icon: "Bell",
        title: "Proactive Notifications",
        description: "Parents receive pickup confirmation, ETA updates, and drop-off alerts automatically."
      },
      {
        icon: "MapPin",
        title: "Privacy-First Tracking",
        description: "Geofence-based location with authorized parent access only."
      }
    ]
  },
  impact: {
    metrics: [
      { value: "12K+", label: "Students" },
      { value: "97%", label: "Parent Satisfaction" },
      { value: "85%", label: "Fewer Calls" },
      { value: "94%", label: "Driver Ease Rating" }
    ]
  },
  learnings: [
    { text: "Design for the context, not just the task—drivers in moving vehicles need different UX than desk workers" },
    { text: "Privacy-preserving design can still provide peace of mind—neighborhood-level is enough" },
    { text: "Proactive notifications eliminate anxiety better than reactive tracking" }
  ]
};

// =====================================================
// MURAL - Creative Collaboration Platform
// =====================================================
export const muralStructured: StructuredProjectData = {
  id: "mural",
  slug: "mural",
  title: "Mural",
  subtitle: "Social collaboration and creative expression platform",
  year: 2019,
  company: "Personal Project",
  heroImage: projMuralNew,
  coverType: "horizontal",
  overview: {
    role: "Product Designer & Brand Designer",
    myContributions: [
      "Conducted competitive analysis of Behance, Dribbble, and Pinterest",
      "Surveyed 30+ creative professionals about platform pain points",
      "Designed complete visual identity and interface system",
      "Created motion design explorations for micro-interactions"
    ],
    team: "Solo project",
    duration: "6 weeks",
    platform: "Mobile",
    tools: ["Adobe XD", "Illustrator", "Photoshop", "After Effects"],
    impact: [
      "3,200+ views on Behance",
      "88% positive feedback",
      "Demonstrated brand + interface design skills",
      "Contributed to job opportunities"
    ]
  },
  gallery: [
    { src: projMuralNew, title: "Mural Platform" }
  ],
  challenge: {
    hook: "Creative platforms prioritize quantity over quality—cluttered feeds that don't let artwork breathe.",
    context: "Users seeking to share creative work lack dedicated spaces that respect the artistic process and facilitate constructive feedback. Existing platforms (Behance, Dribbble, Pinterest) had strengths but also significant limitations in how they presented work.",
    goal: "Design a platform that balances social interaction with creative showcasing—clean, distraction-free, letting content shine."
  },
  process: {
    steps: [
      { title: "Research", duration: "2 weeks", description: "Analyzed Behance, Dribbble, Pinterest; surveyed 30+ creative professionals" },
      { title: "Brand Identity", duration: "1 week", description: "Created visual language—artistic yet accessible" },
      { title: "Interface Design", duration: "2 weeks", description: "Tested grid vs. masonry vs. magazine-style layouts" },
      { title: "Motion Design", duration: "1 week", description: "Animation explorations to enhance without distracting" }
    ],
    insights: [
      { text: "Creatives wanted better project organization and contextual feedback tools" },
      { text: "Algorithmic feeds felt intrusive—users wanted more control over discovery" },
      { text: "Magazine-style layout won for visual harmony across content types" }
    ]
  },
  solution: {
    summary: "A magazine-style creative platform with curated discovery, inspiration boards, and structured feedback.",
    features: [
      {
        icon: "Layout",
        title: "Magazine-Style Layout",
        description: "Adapts to content type and aspect ratio, generous whitespace, subtle typography."
      },
      {
        icon: "Bookmark",
        title: "Inspiration Boards",
        description: "Collect and organize works from others while respecting attribution."
      },
      {
        icon: "MessageCircle",
        title: "Structured Feedback",
        description: "Encourages constructive criticism through prompts rather than simple likes."
      }
    ]
  },
  impact: {
    metrics: [
      { value: "3.2K+", label: "Behance Views" },
      { value: "88%", label: "Positive Feedback" },
      { value: "30+", label: "Creatives Surveyed" }
    ]
  },
  learnings: [
    { text: "Brand identity and interface design should be developed together, not sequentially" },
    { text: "Content-first design means using real creative work during prototyping" },
    { text: "Motion design enhances experience when subtle—distracts when prominent" }
  ]
};

// =====================================================
// AI WRITING ASSISTANT - Content Moderation & AI Writing
// =====================================================
export const aiWritingAssistantStructured: StructuredProjectData = {
  id: "ai-writing-assistant",
  slug: "ai-writing-assistant",
  title: "AI Writing Assistant",
  subtitle: "Content moderation and intelligent writing suggestions for school communications",
  year: 2025,
  company: "isaac (Arco Educação)",
  heroImage: aiWritingAssistant,
  coverType: "horizontal",
  overview: {
    role: "Product Designer",
    myContributions: [
      "Led feature prioritization based on impact and feasibility analysis",
      "Designed content moderation flow with clear violation explanations",
      "Created AI writing assistant interface with real-time preview",
      "Validated with school staff to minimize false positives"
    ],
    team: "PM, 2 Frontend, 1 Backend, AI/ML Specialist",
    duration: "10 weeks",
    platform: "Web",
    tools: ["Figma", "FigJam", "OpenAI API", "React", "Design System"],
    impact: ["TBD - Project in development"]
  },
  gallery: [
    { 
      src: aiWritingAssistant, 
      title: "AI Writing Assistant Demo" 
    },
    {
      src: aiCommsDashboardMp4,
      title: "Communications dashboard tracking AI assistant usage"
    }
  ],
  challenge: {
    hook: "One inappropriate message. Thousands of angry parents. A school's reputation in ruins.",
    context: "Schools faced two critical problems: safety risks from inappropriate content (including a Q2 2025 security breach), and communication quality issues causing friction with families through grammar errors and inappropriate tone.",
    goal: "Create an AI-powered system that prevents problems before they happen—blocking harmful content and elevating communication quality."
  },
  process: {
    steps: [
      { title: "Research", duration: "3 weeks", description: "Analyzed incident reports, interviewed 15+ staff, mapped pain points" },
      { title: "Design", duration: "4 weeks", description: "Created moderation flows and AI writing interface with preview" },
      { title: "Testing", duration: "3 weeks", description: "Validated with school staff, minimized false positives" }
    ],
    insights: [
      { text: "Schools prioritized reviewing content manually, even if it delayed communications—safety over speed" },
      { text: "Generic writing suggestions were ignored; users wanted school-specific context awareness" },
      { text: "Pre-visualization before applying changes was essential for user adoption and trust" }
    ]
  },
  solution: {
    summary: "Two integrated AI features—Content Moderation for safety and AI Writing Assistant for quality—plus a dedicated Communications dashboard so school admins can monitor adoption and impact in real time.",
    features: [
      {
        icon: "Shield",
        title: "Content Moderation",
        description: "Real-time text and image analysis with clear explanations of what triggered alerts."
      },
      {
        icon: "Sparkles",
        title: "AI Writing Assistant",
        description: "Context-aware suggestions with 4 customization dimensions: tone, emoji, formatting, length."
      },
      {
        icon: "Eye",
        title: "Real-time Preview",
        description: "See suggested changes before applying—users maintain full control over their message."
      },
      {
        icon: "BarChart3",
        title: "Communications Dashboard",
        description: "A dedicated dashboard tracks AI assistant adoption, message volume, parent NPS, and response times so admins can measure impact from day one."
      }
    ]
  },
  impact: {
    metrics: [
      { value: "TBD", label: "Adoption Rate" },
      { value: "TBD", label: "Time Saved" },
      { value: "TBD", label: "Incidents Prevented" },
      { value: "TBD", label: "User Satisfaction" }
    ]
  },
  learnings: [
    { text: "AI assistance must preserve user agency—preview before apply is non-negotiable" },
    { text: "Context-aware suggestions outperform generic ones in specialized domains" },
    { text: "Clear explanations for AI decisions build trust and reduce frustration" },
    { text: "Measuring adoption from day one with a dedicated dashboard turns gut feelings into evidence" }
  ]
};

// Map of structured projects by slug
export const structuredProjects: Record<string, StructuredProjectData> = {
  "meu-arco": meuArcoStructured,
  "health-food-delivery": saudeEPontoStructured,
  "digital-signature": digitalSignatureStructured,
  "students-transportation": studentsTransportationStructured,
  "mural": muralStructured,
  "ai-writing-assistant": aiWritingAssistantStructured
};
