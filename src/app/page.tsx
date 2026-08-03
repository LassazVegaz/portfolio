import Footer from "./components/Footer";
import {
  SectionExpertise,
  SectionIntro,
  SectionMySelf,
  SectionTimeline,
} from "./components/Sections";

export default async function Home() {
  return (
    <main className="portfolio-shell">
      <div className="ambient-glow ambient-glow-one" />
      <div className="ambient-glow ambient-glow-two" />

      <header className="site-header">
        <a href="#intro" className="brand" aria-label="Back to top">
          <span className="brand-mark">LW</span>
          <span className="brand-name">Lasindu Weerasinghe</span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#about-me">About</a>
          <a href="#expertise">Expertise</a>
          <a href="#career-timeline">Experience</a>
        </nav>
        <a
          href="https://www.linkedin.com/in/lasindu-weerasinghe"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta"
        >
          Let&apos;s connect <span aria-hidden="true">↗</span>
        </a>
      </header>

      <SectionIntro />
      <SectionMySelf />
      <SectionExpertise />
      <SectionTimeline />
      <Footer />
    </main>
  );
}
