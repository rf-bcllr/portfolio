import projHealthyNew from "@/assets/proj-healthy-new.png";
import projThumbNew3 from "@/assets/proj-thumb-new-3.png";
import projMuralNew from "@/assets/proj-mural-new.png";
import projectThumbNew1 from "@/assets/project-thumb-new-1.jpg";
import projectThumbNew2 from "@/assets/project-thumb-new-2.jpg";
import cyberbrakeMain from "@/assets/cyberbrake/device-detail.png";
import cyberbrakeReport from "@/assets/cyberbrake/generate-report.png";
import cyberbrakeNetwork from "@/assets/cyberbrake/network-detail.png";
import cyberbrakeExplorer from "@/assets/cyberbrake/networks-explorer.png";
import meuArcoOgCover from "@/assets/meu-arco/og-cover.png";

export interface ProjectData {
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
    team: string;
    duration: string;
    tools: string[];
    impact: string[];
  };
  challenge: string;
  process: string;
  solution: string;
  impact: string;
  gallery?: {
    src: string;
    title: string;
  }[];
}

export const projectsData: ProjectData[] = [
  {
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
      team: "Product Manager, 3 Frontend Engineers, 2 Backend Engineers",
      duration: "16 weeks (Q1-Q2 2024)",
      tools: ["Figma", "FigJam", "Miro", "React", "Design System"],
      impact: ["TBD"]
    },
    gallery: [
      { 
        src: "https://storage.googleapis.com/creatorspace-public/users%2Fclnkcjnw802u4ou01tta5rqcm%2FUKVcVl4DB6Bzva11-ScreenRecording2024-11-19at08.19.59-ezgif.com-crop.gif", 
        title: "Meu Arco Platform Demo" 
      },
      { 
        src: meuArcoOgCover, 
        title: "Meu Arco Platform Overview" 
      }
    ],
    challenge: "Arco Educação needed a unified platform to integrate their educational ecosystem, replacing fragmented solutions across multiple brands. Schools, teachers, and students were struggling with disconnected tools, inconsistent experiences, and complex workflows that hindered educational outcomes. The challenge was to create a cohesive platform that would serve diverse user needs while maintaining the unique identity of each brand within the Arco ecosystem.",
    process: "We began with extensive user research across 25+ schools, conducting contextual inquiries with teachers, students, and administrators. I led design thinking workshops with stakeholders from different Arco brands to understand their specific needs and pain points. Through journey mapping and service design, we identified critical touchpoints where users experienced friction. I created multiple design iterations, starting with low-fidelity wireframes and progressing to high-fidelity prototypes. We conducted moderated usability testing sessions with 45+ participants, iterating based on feedback. Close collaboration with the engineering team ensured technical feasibility while maintaining design vision. I established a comprehensive design system to ensure consistency across the platform while allowing brand flexibility.",
    solution: "We delivered Meu Arco as a unified educational platform with three main pillars: a personalized dashboard for quick access to relevant content and tools, an integrated communication system connecting all stakeholders, and a resource library with curated educational materials. The interface features adaptive navigation that adjusts to user roles (student, teacher, administrator), a unified search experience across all Arco brands, and seamless transitions between different educational tools. The design system we created ensures visual consistency while respecting individual brand identities. We implemented progressive disclosure patterns to manage complexity and contextual help to support new users.",
    impact: "TBD"
  },
  {
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
      team: "Solo project (design & research)",
      duration: "8 weeks",
      tools: ["Figma", "FigJam", "Adobe Illustrator", "Photoshop"],
      impact: [
        "92% task completion rate in usability tests",
        "8.7/10 user satisfaction score",
        "Featured on Behance with 2,500+ views",
        "35% faster checkout flow than competitors"
      ]
    },
    gallery: [
      { src: projHealthyNew, title: "Home Screen & Order Flow" },
      { src: projThumbNew3, title: "Product Details & Checkout" }
    ],
    challenge: "Busy professionals struggle to maintain healthy eating habits due to time constraints and limited healthy food options. Existing food delivery apps overwhelm users with too many choices and don't adequately address nutritional needs or dietary preferences. Users often abandon the ordering process due to complex checkout flows and uncertainty about meal nutritional value. The challenge was to create a food delivery experience specifically optimized for health-conscious users who value convenience, transparency, and nutritional information without sacrificing speed or simplicity.",
    process: "I conducted 18 in-depth user interviews with busy professionals (ages 25-45) to understand their eating habits, pain points, and decision-making processes. Through competitive analysis of 8 major food delivery apps, I identified opportunities for differentiation. I created user personas representing different dietary preferences (vegetarian, vegan, low-carb, balanced) and mapped their user journeys from hunger realization to meal consumption. Using rapid prototyping, I tested multiple approaches to meal discovery and selection. Low-fidelity wireframes helped validate information architecture with 12 potential users. I iteratively refined the visual design, testing color psychology for appetite appeal while maintaining a fresh, healthy brand perception. Usability testing with 15 participants validated the checkout flow and nutritional information presentation.",
    solution: "Saúde é Ponto features a smart meal discovery system that learns user preferences and dietary restrictions, presenting personalized recommendations immediately upon opening the app. The interface emphasizes visual hierarchy with high-quality food photography, clear nutritional badges (calories, protein, carbs, fats), and ingredient transparency. A simplified three-step checkout process (meal selection, delivery time, payment) reduces friction compared to traditional seven-step flows. The design includes a meal planning calendar for users to schedule healthy eating throughout the week, a favorites system for quick reordering, and real-time delivery tracking. Nutritional insights are presented in an accessible, non-intimidating way with visual representations and comparisons to daily recommended values.",
    impact: "The Saúde é Ponto prototype demonstrated exceptional usability and user satisfaction in testing. 92% of participants successfully completed the ordering task without assistance, with an average completion time 35% faster than leading competitors. User satisfaction scores averaged 8.7/10, with participants specifically praising the clear nutritional information and streamlined checkout process. When published on Behance, the case study received over 2,500 views and positive feedback from the design community. The project showcased my ability to conduct comprehensive user research, translate insights into elegant design solutions, and create experiences that balance business goals with user needs in the competitive food delivery space."
  },
  {
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
      team: "Solo project",
      duration: "6 weeks",
      tools: ["Adobe XD", "Illustrator", "Photoshop", "After Effects"],
      impact: [
        "Featured on Behance with 3,200+ views",
        "88% positive feedback from design community",
        "Used as portfolio piece for job applications",
        "Demonstrated brand design capabilities"
      ]
    },
    challenge: "Social platforms often prioritize quantity over quality, leading to cluttered experiences that don't foster meaningful creative expression or collaboration. Users seeking to share creative work lack dedicated spaces that respect the artistic process and facilitate constructive feedback. The challenge was to design a platform that balances social interaction with creative showcasing, providing tools for visual storytelling while maintaining a clean, distraction-free interface that lets the content shine.",
    process: "I began by analyzing existing creative platforms (Behance, Dribbble, Pinterest) to understand their strengths and limitations. Through surveys with 30+ creative professionals, I identified desires for better project organization, contextual feedback tools, and more inspiring discovery mechanisms. I developed the Mural brand identity, creating a visual language that felt artistic yet accessible. The name 'Mural' evokes public art spaces where creativity is displayed and appreciated. I designed multiple interface concepts, testing different approaches to content presentation: grid layouts vs. masonry vs. magazine-style. User flow mapping helped optimize the path from content creation to publication to discovery. I created motion design explorations to understand how animations could enhance the experience without distracting from content.",
    solution: "Mural features a magazine-style layout that adapts to content type and aspect ratio, creating a visually harmonious browsing experience. The interface uses generous whitespace and subtle typography to keep focus on creative work. Content creators have tools to organize projects into collections, add context through project descriptions and process documentation, and curate their portfolio presentation. The discovery system uses tags and collections rather than algorithmic feeds, giving users more control over what they see. A unique 'inspiration board' feature allows users to collect and organize works from others while respecting attribution. The feedback system encourages constructive criticism through structured prompts rather than simple likes or reactions.",
    impact: "Mural successfully demonstrated my capabilities in brand design, interface design, and creative platform UX. The Behance case study received over 3,200 views and consistently positive feedback from the design community, with many commenting on the clean aesthetic and thoughtful interaction patterns. The project became a cornerstone of my portfolio, directly contributing to job opportunities and client inquiries. It showcased my ability to think holistically about product design—from brand identity through interface design to interaction patterns—and my understanding of creative professionals' needs having experienced similar pain points in my own work."
  },
  {
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
      team: "Product Manager, 2 Frontend Engineers, 1 Backend Engineer, Legal Advisor",
      duration: "12 weeks (Q3 2022)",
      tools: ["Figma", "Miro", "React", "Design System"],
      impact: [
        "78% reduction in enrollment completion time",
        "95% digital signature adoption rate",
        "60% decrease in enrollment-related support tickets",
        "40% cost savings on paper and printing"
      ]
    },
    challenge: "ClassApp's school enrollment process relied on paper documents requiring physical signatures, creating friction for parents and administrative burden for schools. Parents had to visit schools in person, often multiple times, to complete enrollment. Schools spent significant time and resources managing, storing, and organizing paper documents. With increasing demand for digital solutions (accelerated by the pandemic), schools needed a legally compliant digital signature solution that would be trustworthy, user-friendly, and seamlessly integrated into the existing ClassApp ecosystem.",
    process: "I led discovery research with 15 school administrators and 25 parents to understand current enrollment pain points and concerns about digital signatures. Legal compliance was paramount, so I worked closely with our legal team to understand Brazilian digital signature regulations (ICP-Brasil) and determine technical requirements. Through journey mapping, I identified critical moments where trust and security needed to be communicated. I created multiple design approaches for signature capture: typed signatures, drawn signatures with stylus/finger, and uploaded signature images. Usability testing with 20 parents (including those with limited digital literacy) helped validate the most accessible approach. I designed clear status indicators and progress tracking to reduce anxiety during the enrollment process. Close collaboration with engineering ensured biometric verification and document encryption were implemented without adding UI complexity.",
    solution: "The Digital Signature feature integrates seamlessly into ClassApp's enrollment workflow. Parents receive a notification with a clear call-to-action to begin digital enrollment. The interface presents documents in a scannable format with key information highlighted. Parents can review each document, with expandable sections for full legal text, before proceeding to signature. The signature capture uses a simple drawn-signature approach (finger or stylus) with preview and redo options. We implemented visual security indicators (lock icons, encryption messaging) to build trust. A progress bar shows completion status across multiple documents. Once complete, both parents and schools receive confirmed copies with timestamps and unique verification codes. Schools access a dashboard showing enrollment status across all students, with the ability to send reminders and track completion.",
    impact: "The Digital Signature feature transformed ClassApp's enrollment process with immediate, measurable impact. Enrollment completion time dropped by 78%, from an average of 4.5 days to under 1 day. Within three months, 95% of schools had adopted digital signatures for new enrollments. Support tickets related to enrollment decreased by 60%, freeing school administrators for more valuable work. Schools reported approximately 40% cost savings on paper, printing, and physical storage. Parents praised the convenience, with satisfaction scores increasing from 6.2/10 to 9.1/10 for the enrollment experience. The feature became a key differentiator in ClassApp's sales process and set a new standard for school administration software in Brazil."
  },
  {
    id: "students-transportation",
    slug: "students-transportation",
    title: "Cheguei - Students' Transportation Feature",
    subtitle: "Safety tracking system for school transportation",
    year: 2023,
    company: "ClassApp",
    heroImage: projectThumbNew2,
    coverType: "horizontal",
    overview: {
      role: "Product Designer",
      team: "Product Manager, 3 Engineers, Safety Consultant",
      duration: "14 weeks (Q2-Q3 2023)",
      tools: ["Figma", "FigJam", "React Native", "Design System"],
      impact: [
        "Used by 12,000+ students within first semester",
        "97% parent satisfaction with safety notifications",
        "85% reduction in parent calls about transportation",
        "Featured in education technology publications"
      ]
    },
    challenge: "Parents of students using school transportation services experienced constant anxiety about their children's safety during commutes. They had no visibility into pickup and drop-off times, couldn't confirm their child had boarded the vehicle, and had no way to track transportation location in real-time. Schools and transportation providers faced constant phone calls from worried parents, creating operational inefficiency. The challenge was to design a safety-focused tracking system that would provide peace of mind for parents, reduce operational burden for schools, and remain simple enough for drivers to use while maintaining focus on safety.",
    process: "I conducted ethnographic research by riding with school transportation services and observing the entire pickup/drop-off process. I interviewed 20 parents about their concerns and anxiety points during their children's commutes. Conversations with 10 drivers revealed their workflow constraints and the importance of minimizing distraction. Safety was the primary concern, so I consulted with child safety experts and reviewed best practices from similar systems worldwide. I mapped the complete transportation journey from a parent's, student's, driver's, and school administrator's perspective, identifying critical notification moments. Multiple prototypes explored different approaches to check-in/check-out (driver manual entry, NFC cards, QR codes, automated GPS). Usability testing with drivers emphasized the need for single-tap interactions and large touch targets. Testing with parents validated notification content, timing, and frequency preferences.",
    solution: "Cheguei ('I arrived' in Portuguese) provides comprehensive transportation visibility through a multi-stakeholder system. Drivers use a simplified mobile interface with large buttons to mark pickups and drop-offs with a single tap. The system automatically detects which students should be on each route based on schedules. When a driver marks a student as picked up, parents immediately receive a push notification with timestamp and location. GPS tracking allows parents to view estimated arrival times on a map. When students are dropped off, parents receive another notification with precise time and location verification. The parent interface emphasizes clarity and reassurance, using friendly language and visual confirmations. School administrators have a dashboard showing real-time status of all transportation routes, with alerts for delays or issues. The design carefully balances information transparency with privacy protection, showing location context without precise tracking history.",
    impact: "Cheguei delivered transformative results for student transportation safety and parent peace of mind. Within the first semester, over 12,000 students across 45 schools began using the system. Parent satisfaction with transportation communication increased dramatically, with 97% reporting reduced anxiety about their children's commutes. Schools experienced an 85% reduction in parent calls regarding transportation, freeing staff for other important work. The feature received media attention in education technology publications, positioning ClassApp as an innovator in school safety solutions. Drivers adapted quickly to the system, with 94% reporting it was easy to use without distracting from safe driving. The success of Cheguei led to expansion requests from schools not initially using transportation services, creating new business opportunities for ClassApp."
  },
  {
    id: "ai-writing-assistant",
    slug: "ai-writing-assistant",
    title: "AI Writing Assistant",
    subtitle: "Content moderation and intelligent writing suggestions for school communications",
    year: 2025,
    company: "isaac (Arco Educação)",
    heroImage: "https://storage.googleapis.com/creatorspace-public/users%2Fclnkcjnw802u4ou01tta5rqcm%2F6fsoLs1a9Yicj3I3-IA.gif",
    coverType: "horizontal",
    overview: {
      role: "Product Designer",
      team: "Product Manager, 2 Frontend Engineers, 1 Backend Engineer, AI/ML Specialist",
      duration: "10 weeks (Q2-Q3 2025)",
      tools: ["Figma", "FigJam", "OpenAI API", "React", "Design System"],
      impact: ["TBD"]
    },
    challenge: "School communications faced two critical challenges that required immediate attention. First, safety risks emerged from inappropriate content incidents, including a significant Q2 2025 security breach that exposed schools to serious reputational damage. Attack scenarios ranged from unauthorized account access by malicious actors to disgruntled staff members posting harmful content, and even unintentional operational errors by well-meaning but careless staff. Second, communication quality issues created unnecessary friction with families. Messages often contained grammar errors, used inappropriate tone for sensitive situations, or employed confusing language that frustrated parents. Manual review processes designed to prevent these issues instead slowed response times and created bureaucratic bottlenecks, leaving families waiting for important information. Given isaac's competitive position against ClassApp and the upcoming migration to the Meu Arco platform, we needed a differentiation strategy that provided immediate, tangible value to users.",
    process: "We prioritized AI features based on comprehensive impact and technical feasibility analysis across all isaac communication modules. The research phase included analyzing incident reports and support tickets related to communication problems, interviewing 15+ school staff members about their communication workflows, mapping pain points in the existing communication creation process, and evaluating OpenAI's Moderation API capabilities and limitations. During the design phase, I created user flows for both preventive moderation scenarios and assistive writing suggestion scenarios. I designed contextual feedback interfaces for flagged content with detailed explanations to help users understand violations. The AI writing assistant interface was prototyped with real-time preview capabilities to give users confidence before applying suggestions. Testing with school staff validated usefulness while minimizing frustration from false positives. On the technical architecture side, content moderation runs automatically on text submission, with parallel processing for multiple image uploads to optimize performance. The AI writing assistant offers preset customization options (tone, emoji usage, formatting richness, length) rather than freeform prompts. All API calls are logged for monitoring, improvement, and compliance.",
    solution: "We launched two integrated AI-powered features in the Communications module that work seamlessly together. The Content Moderation System provides real-time text analysis using OpenAI's Moderation API (leveraging the free tier for cost efficiency), automatic image moderation during upload with clear visual blocking indicators, detailed flagging with specific violation categories (violence, sexual content, harassment, hate speech), generative AI explanations showing exactly which words or phrases triggered alerts, and user-friendly error messages with actionable guidance for making corrections. The AI Writing Assistant is accessible via a prominent button next to the text field and works on both full text and selected portions. It offers four customization dimensions: Tone (Neutral, Formal, Urgent), Emoji usage (None, Regular, Many), Formatting richness (Simple, Balanced, Rich), and Length (Shorten, Maintain, Lengthen). Users see a real-time preview before applying any suggestions, ensuring they maintain control over the final message. The assistant provides grammar correction and intelligent rephrasing that's specifically context-aware for school-to-family communication scenarios. Both features were specifically implemented for the Comunicados (Announcements) module, focusing on school-initiated communications where safety and professionalism matter most.",
    impact: "TBD"
  },
  {
    id: "cyberbrake",
    slug: "cyberbrake",
    title: "Risk Analysis Dashboard for Cyberbrake",
    subtitle: "Page under construction",
    year: 2023,
    company: "Personal Project",
    heroImage: "/lovable-uploads/90169309-3cbd-483f-8bdc-c5e96fc950da.png",
    coverType: "horizontal",
    overview: {
      role: "Product Designer",
      team: "TBD",
      duration: "TBD",
      tools: ["TBD"],
      impact: ["Page under construction"]
    },
    challenge: "🚧 This case study is currently under construction. Check back soon for the full story!",
    process: "🚧 Under construction...",
    solution: "🚧 Under construction...",
    impact: "TBD",
    gallery: [
      { src: "/lovable-uploads/90169309-3cbd-483f-8bdc-c5e96fc950da.png", title: "Dashboard Overview" },
      { src: cyberbrakeMain, title: "Device Detail View" },
      { src: cyberbrakeReport, title: "Generate Report Interface" },
      { src: cyberbrakeNetwork, title: "Network Detail Dashboard" },
      { src: cyberbrakeExplorer, title: "Network Analysis Explorer" }
    ]
  }
];
