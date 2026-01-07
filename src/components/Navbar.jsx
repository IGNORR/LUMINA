import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { toggleLanguage, language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cartCount = cart.length;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl text-gray-700 hover:text-gray-900 transition-colors">
              LUMINA
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/gallery" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              {t('nav.gallery')}
            </Link>
            <Link 
              to="/cart" 
              className="relative text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              <span>{t('nav.cart')}</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[1.5rem] px-2 h-6 text-xs rounded-full bg-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            {user && (
              <>
                <Link 
                  to="/admin" 
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {t('nav.admin')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </>
            )}
            <button
              onClick={toggleLanguage}
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium uppercase tracking-wide"
              title={language === 'en' ? 'Перемкнути на українську' : 'Switch to English'}
            >
              {language === 'en' ? 'UK' : 'EN'}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium uppercase tracking-wide"
              title={language === 'en' ? 'Перемкнути на українську' : 'Switch to English'}
            >
              {language === 'en' ? 'UK' : 'EN'}
            </button>
            <button className="text-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

