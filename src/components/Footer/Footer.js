
import './Footer.scss'
const Footer = () => {
  return (
    <footer className="footer">
      
      <p>
        We offer online etiquette lessons for all ages, guided by an experienced instructor.  
        Our affordable courses cover various styles and approaches, with free videos from Ms. Julie to help everyone practice proper etiquette.
      </p>
    
      <p>© {new Date().getFullYear()} Etiquette Academy. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
