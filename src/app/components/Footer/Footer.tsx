const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer section-container">
      <div className="footer-cta">
        <p className="eyebrow">Have an interesting problem?</p>
        <h2>Let&apos;s build something that matters.</h2>
        <a href="https://www.linkedin.com/in/lasindu-weerasinghe" target="_blank" rel="noopener noreferrer" className="button button-primary">
          Start a conversation <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="footer-bottom">
        <p>&copy; {year} Lasindu Nuwanga Weerasinghe</p>
        <p>Engineered with care in Sri Lanka.</p>
      </div>
    </footer>
  );
};

export default Footer;
