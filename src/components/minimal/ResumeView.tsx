/** Resume: a small portrait, the work history, what colleagues say, and the PDF. */
import { ArrowDown } from "lucide-react";
import { person, portrait } from "@/components/canvas/shared";
import { experiences } from "@/data/resume";
import { translations } from "@/hooks/useTranslations";
import { generateResumePDF } from "@/utils/generateResumePDF";

const quotes = translations.en.recommendationsItems;

export function ResumeView() {
  return (
    <article className="mn-resume">
      <header className="mn-r-head">
        <img src={portrait} alt="Rafael Bacellar" width={88} height={88} />
        <div>
          <h1>Rafael Bacellar</h1>
          <p>Senior product designer</p>
        </div>
        <button type="button" className="mn-btn" onClick={() => generateResumePDF("en")}><ArrowDown size={16} strokeWidth={2} aria-hidden="true" /> Download resume</button>
      </header>

      <section className="mn-r-sec" aria-labelledby="mn-exp">
        <h2 id="mn-exp">Experience</h2>
        <ol className="mn-r-exp">
          {experiences.map((e) => (
            <li key={e.company}>
              <p className="mn-r-p">{e.period}</p>
              <div><b>{e.company}</b><p>{e.title}</p><p className="mn-r-d">{e.description}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mn-r-sec" aria-labelledby="mn-rec">
        <h2 id="mn-rec">What colleagues say</h2>
        <div className="mn-r-quotes">
          {quotes.map((q) => (
            <figure key={q.author}>
              <blockquote>{q.quote}</blockquote>
              <figcaption><a className="mn-link" href={q.linkedin} target="_blank" rel="noreferrer">{q.author}</a><span>{q.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <p className="mn-r-foot">
        <a className="mn-link" href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a className="mn-link" href="/certifications">Certifications</a>
      </p>
    </article>
  );
}
