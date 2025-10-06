import jsPDF from 'jspdf';

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  secondaryChips?: string[];
}

interface Language {
  name: string;
  level: string;
}

export const generateResumePDF = (language: 'pt' | 'en') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set margins
  const marginLeft = 20;
  const marginRight = 20;
  const pageWidth = 210; // A4 width in mm
  const contentWidth = pageWidth - marginLeft - marginRight;
  let yPosition = 22;

  // Helper to add text with wrapping
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number, isBold = false, color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.35);
  };

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Rafael Bacellar Ramos Reis', marginLeft, yPosition);
  yPosition += 6;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('End-to-End Product Designer', marginLeft, yPosition);
  yPosition += 5;

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Aracaju, SE, Brasil', marginLeft, yPosition);
  yPosition += 4;
  doc.text('rfbcllr@gmail.com • +55 71 991373998', marginLeft, yPosition);
  yPosition += 5;

  // LinkedIn and Portfolio links (clickable blue underlined)
  doc.setTextColor(0, 0, 255);
  doc.setFont('helvetica', 'normal');
  doc.textWithLink('LinkedIn: https://www.linkedin.com/in/rfbcllr/', marginLeft, yPosition, {
    url: 'https://www.linkedin.com/in/rfbcllr/'
  });
  yPosition += 4;
  doc.textWithLink('Portfolio: https://rfbcllr.short.gy/portfolio', marginLeft, yPosition, {
    url: 'https://rfbcllr.short.gy/portfolio'
  });
  yPosition += 8;

  doc.setTextColor(0, 0, 0);

  // Summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SUMMARY', marginLeft, yPosition);
  yPosition += 5;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summary = language === 'pt' 
    ? 'Designer de Produto com mais de 8 anos de experiência em design end-to-end, liderança de projetos e pesquisa com usuários. Especializado em criar soluções escaláveis que impactam positivamente milhares de usuários.'
    : 'Product Designer with over 8 years of experience in end-to-end design, project leadership, and user research. Specialized in creating scalable solutions that positively impact thousands of users.';
  yPosition = addText(summary, marginLeft, yPosition, contentWidth, 10);
  yPosition += 6;

  // Experience
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('EXPERIENCE', marginLeft, yPosition);
  yPosition += 6;

  const experiences: Experience[] = [
    {
      title: 'Product Designer',
      company: 'isaac',
      period: language === 'pt' ? '2024 - Presente' : '2024 - Present',
      description: language === 'pt' 
        ? 'Design de produtos digitais end-to-end, design system e interfaces escaláveis.'
        : 'End-to-end digital product design, design system and scalable interfaces.',
      secondaryChips: ['Fintech', 'B2B', 'B2C']
    },
    {
      title: 'Product Designer',
      company: 'ClassApp',
      period: '2021 - 2024',
      description: language === 'pt'
        ? 'Liderança em design de produto, pesquisa com usuários e colaboração com desenvolvimento.'
        : 'Product design leadership, user research and development collaboration.',
      secondaryChips: ['Edtech', 'B2B', 'B2C']
    },
    {
      title: 'Design Analyst',
      company: 'Le biscuit',
      period: '2019 - 2021',
      description: language === 'pt'
        ? 'Análise e design de interfaces digitais, melhoria de experiência do usuário.'
        : 'Digital interface analysis and design, user experience improvement.',
      secondaryChips: ['Retail', 'B2B', 'B2C']
    },
    {
      title: 'Design & Marketing Analyst',
      company: 'Sebrae Bahia',
      period: '2017 - 2019',
      description: language === 'pt'
        ? 'Design gráfico, marketing digital e comunicação visual para empreendedores.'
        : 'Graphic design, digital marketing and visual communication for entrepreneurs.',
      secondaryChips: ['Govt. Agency', 'B2B']
    },
    {
      title: 'Brand Designer',
      company: 'Sanar',
      period: '2015 - 2016',
      description: language === 'pt'
        ? 'Desenvolvimento de identidade visual e materiais de marca para educação médica.'
        : 'Visual identity development and brand materials for medical education.',
      secondaryChips: ['Healthtech', 'B2C']
    }
  ];

  experiences.forEach((exp) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 22;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(exp.title, marginLeft, yPosition);
    yPosition += 5;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(exp.company, marginLeft, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const periodWidth = doc.getTextWidth(exp.period);
    doc.text(exp.period, pageWidth - marginRight - periodWidth, yPosition);
    yPosition += 4;

    if (exp.secondaryChips) {
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(exp.secondaryChips.join(' • '), marginLeft, yPosition);
      yPosition += 4;
    }

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    yPosition = addText(exp.description, marginLeft, yPosition, contentWidth, 10);
    yPosition += 5;
  });

  // Check page break before Education
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 22;
  }

  // Education
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('EDUCATION', marginLeft, yPosition);
  yPosition += 6;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(language === 'pt' ? 'Bacharelado em Design' : 'Bachelor in Design', marginLeft, yPosition);
  yPosition += 5;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(language === 'pt' ? 'Universidade do Estado da Bahia' : 'Bahia State University', marginLeft, yPosition);
  
  doc.setTextColor(100, 100, 100);
  const eduPeriod = '2016 - 2021';
  const eduPeriodWidth = doc.getTextWidth(eduPeriod);
  doc.text(eduPeriod, pageWidth - marginRight - eduPeriodWidth, yPosition);
  yPosition += 8;

  // Hard Skills
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('HARD SKILLS', marginLeft, yPosition);
  yPosition += 5;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const skills = 'User Research, Visual Design, Prototyping, Design System, Usability Testing, Information Architecture, Interaction Design, Design Thinking, Agile, UX Writing, Accessibility, HTML/CSS';
  yPosition = addText(skills, marginLeft, yPosition, contentWidth, 10);
  yPosition += 6;

  // Languages
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(language === 'pt' ? 'IDIOMAS' : 'LANGUAGES', marginLeft, yPosition);
  yPosition += 5;

  const languages: Language[] = [
    { name: language === 'pt' ? 'Português' : 'Portuguese', level: language === 'pt' ? 'Nativo' : 'Native' },
    { name: language === 'pt' ? 'Inglês' : 'English', level: language === 'pt' ? 'Avançado' : 'Advanced' },
    { name: language === 'pt' ? 'Alemão' : 'German', level: language === 'pt' ? 'Básico' : 'Basic' },
    { name: language === 'pt' ? 'Espanhol' : 'Spanish', level: language === 'pt' ? 'Básico' : 'Basic' }
  ];

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  languages.forEach((lang, index) => {
    doc.text(`${lang.name}: ${lang.level}`, marginLeft, yPosition);
    yPosition += 4;
  });

  // Set PDF metadata
  doc.setProperties({
    title: 'Rafael Bacellar Resume',
    author: 'Rafael Bacellar Ramos Reis',
    subject: 'Product Designer Resume',
    keywords: 'product designer, UX, UI, design system'
  });

  // Download
  doc.save('Rafael_Bacellar_Resume.pdf');
};
