const expertise = [
  {
    number: "01",
    icon: "⌘",
    title: "Platform & backend engineering",
    description:
      "Reliable APIs, event-driven services, and business-critical systems designed for security, clarity, and long-term change.",
    technologies: [".NET", "NestJS", "PostgreSQL", "Microservices"],
  },
  {
    number: "02",
    icon: "◇",
    title: "Cloud & delivery",
    description:
      "Production infrastructure, CI/CD, observability, and practical automation that help teams ship confidently.",
    technologies: ["AWS", "Azure", "GitLab CI/CD", "OpenTelemetry"],
  },
  {
    number: "03",
    icon: "✦",
    title: "Full-stack & AI products",
    description:
      "Thoughtful user experiences backed by modern TypeScript systems and AI capabilities that solve real product needs.",
    technologies: ["Next.js", "TypeScript", "OpenAI", "Vector search"],
  },
];

export default function SectionExpertise() {
  return (
    <section id="expertise" className="expertise section-container section-spacing">
      <div className="section-label"><span>02</span> Expertise</div>
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">What I bring to a team</p>
          <h2>From the first diagram to production.</h2>
        </div>
        <p>
          I move comfortably between architecture, implementation, delivery,
          and the messy edges where systems meet.
        </p>
      </div>
      <div className="expertise-grid">
        {expertise.map((item) => (
          <article className="expertise-card" key={item.title}>
            <div className="expertise-card-head">
              <span className="expertise-icon">{item.icon}</span>
              <span className="expertise-number">{item.number}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="tag-list">
              {item.technologies.map((technology) => <span key={technology}>{technology}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
