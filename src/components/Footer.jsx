import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('about');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById('about');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-serif text-gray-900 tracking-tight mb-4">{t('footer.brand')}</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              {t('footer.description')}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-black transition-colors">{t('nav.home')}</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-500 hover:text-black transition-colors">{t('nav.gallery')}</Link>
              </li>
              <li>
                <a 
                  href="/#about" 
                  onClick={handleAboutClick}
                  className="text-gray-500 hover:text-black transition-colors cursor-pointer"
                >
                  {t('footer.aboutUs')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>Площа Ринок, 10</li>
              <li>Львів, Україна 79000</li>
              <li className="pt-2">
                <a href="mailto:gallery@lumina.art" className="text-black hover:underline">gallery@lumina.art</a>
              </li>
              <li>+380 99 123 45 67</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">{t('footer.followUs')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-black transition-colors">Instagram</a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-black transition-colors">Twitter</a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-black transition-colors">Facebook</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>&copy; {currentYear} {t('footer.brand')}.</p>
          <p className="mt-2 md:mt-0">{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
