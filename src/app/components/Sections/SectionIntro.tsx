import { Icons } from "../Icons";

const SectionIntro = () => (
  <section id="intro" className="hero section-container">
    <div className="hero-copy">
      <div className="availability-pill">
        <span className="availability-dot" /> Open to senior engineering roles
      </div>
      <p className="eyebrow">Senior Software Engineer · Sri Lanka → Singapore</p>
      <h1>
        I build software that <span>holds up in the real world.</span>
      </h1>
      <p className="hero-lede">
        Six years of turning complex product and platform problems into clear,
        reliable systems—with .NET, TypeScript, cloud architecture, and a
        healthy obsession for maintainable code.
      </p>
      <div className="hero-actions">
        <a href="#career-timeline" className="button button-primary">
          Explore my work <span aria-hidden="true">↓</span>
        </a>
        <a
          href="https://github.com/LassazVegaz"
          target="_blank"
          rel="noopener noreferrer"
          className="button button-secondary"
        >
          View GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
      <Icons className="hero-socials" />
    </div>

    <div className="hero-visual" aria-label="A summary of Lasindu's engineering profile">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="code-card">
        <div className="code-card-topbar">
          <div className="window-dots"><i /><i /><i /></div>
          <span>engineer.ts</span>
          <span>⌁</span>
        </div>
        <div className="code-content" aria-hidden="true">
          <p><b>const</b> engineer = {'{'}</p>
          <p className="indent">name: <em>&quot;Lasindu&quot;</em>,</p>
          <p className="indent">focus: [</p>
          <p className="indent-two"><em>&quot;Cloud platforms&quot;</em>,</p>
          <p className="indent-two"><em>&quot;AI products&quot;</em>,</p>
          <p className="indent-two"><em>&quot;Microservices&quot;</em></p>
          <p className="indent">],</p>
          <p className="indent">principle: <em>&quot;Build it to last&quot;</em></p>
          <p>{'}'};</p>
        </div>
        <div className="code-status">
          <span><i /> Systems operational</span>
          <span>Ln 12, Col 4</span>
        </div>
      </div>
      <div className="floating-chip chip-dotnet">.NET</div>
      <div className="floating-chip chip-typescript">TS</div>
      <div className="floating-chip chip-aws">AWS</div>
    </div>

    <div className="hero-stats">
      <div><strong>6+</strong><span>Years building software</span></div>
      <div><strong>25+</strong><span>Freelance projects delivered</span></div>
      <div><strong>SG</strong><span>Public-sector experience</span></div>
      <div><strong>5★</strong><span>Consistent client ratings</span></div>
    </div>
  </section>
);

export default SectionIntro;
