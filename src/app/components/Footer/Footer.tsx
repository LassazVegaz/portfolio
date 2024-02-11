const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="py-10 text-center border-t-2 border-gray-300 dark:border-gray-500 dark:text-slate-400">
      <p>&copy; {year} Lasindu Nuwanga Weerasinghe</p>
    </footer>
  );
};

export default Footer;
