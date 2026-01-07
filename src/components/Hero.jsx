import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const Hero = () => {
  const { t } = useTranslation();
  
  return (
    <section className="min-h-[85vh] flex items-center bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-lg">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-wide text-black mb-6 font-normal">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-10 font-sans leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <Link
                to="/gallery"
                className="inline-block px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-medium tracking-wide"
              >
                {t('hero.cta')}
              </Link>
            </div>
          </div>

          <div className="flex-1 relative h-[50vh] md:h-[60vh] lg:h-[70vh] w-full">
            <img
              src="/banner.jpg"
              alt="Abstract Art"
              className="w-full h-full object-cover rounded-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
