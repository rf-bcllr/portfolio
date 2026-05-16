import jsPDF from "jspdf";

/**
 * Inline text run for mixed bold/regular paragraphs.
 */
type Run = { text: string; bold?: boolean; italic?: boolean };

interface ExperienceEntry {
  company: string;
  location: string;
  role: string; // shown italic, may include " | Subtitle"
  period: string; // italic dates
  bullets: Run[][]; // each bullet is an array of runs
}

interface EducationEntry {
  school: string;
  location: string;
  degree: string; // italic
  period: string;
}

export const generateResumePDF = (language: "pt" | "en") => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 22;
  const marginTop = 24;
  const marginBottom = 22;
  const contentWidth = pageWidth - marginX * 2;

  const BLACK: [number, number, number] = [17, 17, 17];
  const LINK: [number, number, number] = [13, 102, 194];

  let y = marginTop;

  const setColor = (c: [number, number, number]) =>
    doc.setTextColor(c[0], c[1], c[2]);

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - marginBottom) {
      doc.addPage();
      y = marginTop;
    }
  };

  const setFont = (size: number, weight: "normal" | "bold" = "normal", style: "normal" | "italic" = "normal") => {
    doc.setFontSize(size);
    let fontStyle: "normal" | "bold" | "italic" | "bolditalic" = "normal";
    if (weight === "bold" && style === "italic") fontStyle = "bolditalic";
    else if (weight === "bold") fontStyle = "bold";
    else if (style === "italic") fontStyle = "italic";
    doc.setFont("helvetica", fontStyle);
  };

  /** Render a paragraph with inline bold/italic runs, justified or left. */
  const renderRuns = (
    runs: Run[],
    x: number,
    maxWidth: number,
    fontSize: number,
    lineHeight: number,
    options: { justify?: boolean } = {}
  ) => {
    setColor(BLACK);
    // Tokenize into words preserving styling
    type Token = { text: string; bold: boolean; italic: boolean; space: boolean };
    const tokens: Token[] = [];
    runs.forEach((r) => {
      const parts = r.text.split(/(\s+)/);
      parts.forEach((p) => {
        if (!p) return;
        if (/^\s+$/.test(p)) {
          tokens.push({ text: " ", bold: !!r.bold, italic: !!r.italic, space: true });
        } else {
          tokens.push({ text: p, bold: !!r.bold, italic: !!r.italic, space: false });
        }
      });
    });

    const measure = (t: Token) => {
      setFont(fontSize, t.bold ? "bold" : "normal", t.italic ? "italic" : "normal");
      return doc.getTextWidth(t.text);
    };

    // Build lines greedily
    const lines: Token[][] = [];
    let current: Token[] = [];
    let currentWidth = 0;

    tokens.forEach((tok) => {
      const w = measure(tok);
      if (tok.space) {
        if (current.length === 0) return; // skip leading space
        if (currentWidth + w > maxWidth) {
          lines.push(current);
          current = [];
          currentWidth = 0;
          return;
        }
        current.push(tok);
        currentWidth += w;
      } else {
        if (currentWidth + w > maxWidth && current.length > 0) {
          // trim trailing space
          while (current.length && current[current.length - 1].space) {
            currentWidth -= measure(current.pop()!);
          }
          lines.push(current);
          current = [tok];
          currentWidth = w;
        } else {
          current.push(tok);
          currentWidth += w;
        }
      }
    });
    if (current.length) {
      while (current.length && current[current.length - 1].space) current.pop();
      lines.push(current);
    }

    lines.forEach((line, idx) => {
      ensureSpace(lineHeight);
      const isLast = idx === lines.length - 1;
      const wordTokens = line.filter((t) => !t.space);
      const spaceCount = line.filter((t) => t.space).length;
      const wordsWidth = line.reduce(
        (sum, t) => sum + (t.space ? 0 : measure(t)),
        0
      );
      const baseSpaceWidth = (() => {
        setFont(fontSize, "normal", "normal");
        return doc.getTextWidth(" ");
      })();
      let spaceWidth = baseSpaceWidth;
      if (options.justify && !isLast && spaceCount > 0 && wordTokens.length > 1) {
        spaceWidth = (maxWidth - wordsWidth) / spaceCount;
        // clamp to avoid absurd spacing
        if (spaceWidth > baseSpaceWidth * 3) spaceWidth = baseSpaceWidth * 1.4;
      }

      let cursorX = x;
      line.forEach((t) => {
        if (t.space) {
          cursorX += spaceWidth;
        } else {
          setFont(fontSize, t.bold ? "bold" : "normal", t.italic ? "italic" : "normal");
          doc.text(t.text, cursorX, y);
          cursorX += measure(t);
        }
      });
      y += lineHeight;
    });
  };

  const sectionHeader = (label: string) => {
    ensureSpace(14);
    y += 4.5;
    setFont(10.5, "bold");
    setColor(BLACK);
    doc.text(label.toUpperCase(), marginX, y);
    y += 6;
  };

  // ========== HEADER ==========
  setFont(22, "bold");
  setColor(BLACK);
  doc.text("Rafael Bacellar", marginX, y);
  y += 9;

  setFont(9.5, "bold");
  doc.text(
    "Senior Product Designer | AI-Driven Design | Design Systems",
    marginX,
    y
  );
  y += 5.2;

  // Contact line with clickable email + linkedin
  setFont(9, "normal");
  setColor(BLACK);
  const contactParts = [
    { text: "Aracaju, SE, Brazil", link: null as string | null },
    { text: "LinkedIn", link: "https://www.linkedin.com/in/rfbcllr/" },
    { text: "rfbcllr@gmail.com", link: "mailto:rfbcllr@gmail.com" },
    { text: "+55 71 99137-3998", link: null },
  ];
  let cx = marginX;
  contactParts.forEach((part, i) => {
    if (i > 0) {
      setColor(BLACK);
      doc.text(" | ", cx, y);
      cx += doc.getTextWidth(" | ");
    }
    if (part.link) {
      setColor(LINK);
      doc.textWithLink(part.text, cx, y, { url: part.link });
    } else {
      setColor(BLACK);
      doc.text(part.text, cx, y);
    }
    cx += doc.getTextWidth(part.text);
  });
  y += 3;

  // ========== PROFILE ==========
  sectionHeader("Profile");
  const profile: Run[] =
    language === "pt"
      ? [
          { text: "Senior Product Designer com mais de " },
          { text: "10 anos de experiência", bold: true },
          { text: " em " },
          { text: "design end-to-end de produtos digitais", bold: true },
          { text: ", " },
          { text: "design systems", bold: true },
          { text: " e " },
          { text: "fluxos guiados por IA generativa", bold: true },
          { text: ". Hábil em " },
          { text: "pensamento estratégico", bold: true },
          { text: ", colaboração com engenharia e pesquisa com usuários, entregando soluções escaláveis que impactam positivamente milhares de pessoas em " },
          { text: "fintech, edtech e ambientes B2B/B2C", bold: true },
          { text: ". Fluente em português e inglês." },
        ]
      : [
          { text: "Senior Product Designer with over " },
          { text: "10 years of experience", bold: true },
          { text: " in " },
          { text: "end-to-end digital product design", bold: true },
          { text: ", " },
          { text: "design systems", bold: true },
          { text: ", and " },
          { text: "GenAI-driven product flows", bold: true },
          { text: ". Skilled in " },
          { text: "strategic thinking", bold: true },
          { text: ", cross-functional collaboration, and user research, delivering scalable solutions that positively impact thousands of users across " },
          { text: "fintech, edtech, and B2B/B2C environments", bold: true },
          { text: ". Fluent in Portuguese and English." },
        ];
  renderRuns(profile, marginX, contentWidth, 8.5, 5, { justify: true });

  // ========== EXPERIENCE ==========
  sectionHeader(language === "pt" ? "Experiência" : "Experience");

  const experiences: ExperienceEntry[] = [
    {
      company: "FTD Educação",
      location: "Brasil",
      role: "Senior Product Designer | Design Lead @ AI Center of Excellence",
      period: "2026 – Present",
      bullets: [
        [
          { text: "Lead " },
          { text: "GenAI-powered product initiatives", bold: true },
          { text: " across edtech experiences for K-12 educators and students." },
        ],
        [
          { text: "Design representative at the " },
          { text: "AI Center of Excellence (COE) for Grupo Marista", bold: true },
          { text: ", shaping AI guidelines, evaluation criteria, and shared design patterns." },
        ],
        [
          { text: "Partner with product, engineering, and pedagogy teams to ship " },
          { text: "scalable, accessible interfaces", bold: true },
          { text: " for B2B and B2C audiences." },
        ],
      ],
    },
    {
      company: "isaac",
      location: "Brasil",
      role: "Product Designer | Core Product & Design System",
      period: "2024 – 2026",
      bullets: [
        [
          { text: "Owned " },
          { text: "end-to-end digital product design", bold: true },
          { text: " for fintech flows used by schools across Brazil." },
        ],
        [
          { text: "Contributed to the " },
          { text: "design system", bold: true },
          { text: ", improving consistency and shipping velocity across squads." },
        ],
        [
          { text: "Ran " },
          { text: "user research", bold: true },
          { text: " and usability tests to validate complex B2B/B2C journeys." },
        ],
      ],
    },
    {
      company: "ClassApp",
      location: "Brasil",
      role: "Product Designer | Edtech Communication Platform",
      period: "2021 – 2024",
      bullets: [
        [
          { text: "Led " },
          { text: "product design", bold: true },
          { text: " for communication tools used by thousands of schools and families." },
        ],
        [
          { text: "Drove " },
          { text: "user research and discovery", bold: true },
          { text: " in close collaboration with PMs and engineering." },
        ],
        [
          { text: "Designed scalable patterns for " },
          { text: "multi-platform experiences", bold: true },
          { text: " across web and mobile." },
        ],
      ],
    },
    {
      company: "Le biscuit",
      location: "Brasil",
      role: "Design Analyst | Digital Retail",
      period: "2019 – 2021",
      bullets: [
        [
          { text: "Analyzed and " },
          { text: "redesigned digital interfaces", bold: true },
          { text: " to improve conversion and customer experience." },
        ],
        [
          { text: "Collaborated with marketing and e-commerce teams on " },
          { text: "campaign and product page design", bold: true },
          { text: "." },
        ],
      ],
    },
    {
      company: "Sebrae Bahia",
      location: "Brasil",
      role: "Design & Marketing Analyst | Government Agency",
      period: "2017 – 2019",
      bullets: [
        [
          { text: "Designed " },
          { text: "graphic and digital materials", bold: true },
          { text: " supporting entrepreneurs across Bahia." },
        ],
        [
          { text: "Produced " },
          { text: "visual communication", bold: true },
          { text: " for workshops, campaigns, and institutional content." },
        ],
      ],
    },
    {
      company: "Sanar",
      location: "Brasil",
      role: "Brand Designer | Medical Education",
      period: "2015 – 2016",
      bullets: [
        [
          { text: "Developed " },
          { text: "visual identity and brand materials", bold: true },
          { text: " for medical education products." },
        ],
      ],
    },
  ];

  experiences.forEach((exp, idx) => {
    ensureSpace(28);
    if (idx > 0) y += 3;

    // Company - Location (bold)
    setFont(10, "bold");
    setColor(BLACK);
    doc.text(`${exp.company} – ${exp.location}`, marginX, y);
    y += 4.6;

    // Role (italic)
    setFont(8.5, "normal", "italic");
    doc.text(exp.role, marginX, y);
    y += 4.2;

    // Period (italic)
    setFont(8.5, "normal", "italic");
    doc.text(exp.period, marginX, y);
    y += 5;

    // Bullets
    exp.bullets.forEach((bullet) => {
      ensureSpace(5.5);
      setFont(8.5, "normal");
      setColor(BLACK);
      doc.text("•", marginX + 2, y);
      const bulletIndent = 6.5;
      renderRuns(
        bullet,
        marginX + bulletIndent,
        contentWidth - bulletIndent,
        8.5,
        5.2,
        { justify: false }
      );
      y += 1.2;
    });
  });

  // ========== EDUCATION ==========
  sectionHeader(language === "pt" ? "Educação" : "Education");
  const education: EducationEntry[] = [
    {
      school: "Universidade do Estado da Bahia",
      location: "Salvador, Brasil",
      degree:
        language === "pt"
          ? "Bacharelado em Design"
          : "B.A. in Design",
      period: "2016 – 2021",
    },
  ];

  education.forEach((edu) => {
    ensureSpace(12);
    setFont(10, "bold");
    setColor(BLACK);
    doc.text(`${edu.school} – ${edu.location}`, marginX, y);
    y += 4.6;
    setFont(8.5, "normal", "italic");
    doc.text(`${edu.degree} | ${edu.period}`, marginX, y);
    y += 5;
  });

  // ========== SKILLS ==========
  sectionHeader(language === "pt" ? "Habilidades" : "Skills");

  const skillsGroups: Array<[string, string]> = [
    [
      language === "pt" ? "Hard Skills" : "Hard Skills",
      "User Research, Visual Design, Prototyping, Design Systems, Usability Testing, Information Architecture, Interaction Design, GenAI Product Design, Accessibility, HTML/CSS",
    ],
    [
      language === "pt" ? "Soft Skills" : "Soft Skills",
      "Strategic thinking, Communication, Cross-functional collaboration, Product sense, Fast iterations, Storytelling, Leadership",
    ],
    [
      language === "pt" ? "Ferramentas" : "Tools",
      "Figma, FigJam, Miro, Notion, Jira, Adobe Creative Suite, Zeroheight, ChatGPT, Claude, Lovable",
    ],
  ];

  skillsGroups.forEach(([label, value]) => {
    renderRuns(
      [{ text: `${label}: `, bold: true }, { text: value }],
      marginX,
      contentWidth,
      9,
      4.8,
      { justify: false }
    );
    y += 1.8;
  });

  // ========== LANGUAGES ==========
  sectionHeader(language === "pt" ? "Idiomas" : "Languages");
  const langs =
    language === "pt"
      ? "Português (Nativo) • Inglês (Avançado) • Alemão (Básico) • Espanhol (Básico)"
      : "Portuguese (Native) • English (Advanced) • German (Basic) • Spanish (Basic)";
  setFont(9, "normal");
  setColor(BLACK);
  doc.text(langs, marginX, y);

  doc.setProperties({
    title: "Rafael Bacellar Resume",
    author: "Rafael Bacellar Ramos Reis",
    subject: "Senior Product Designer Resume",
    keywords: "product designer, UX, UI, design system, GenAI",
  });

  doc.save("Rafael_Bacellar_Resume.pdf");
};
