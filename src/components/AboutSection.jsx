import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const AboutSection = () => {
  const { t } = useTranslation();
  const quote = t('about.quote');
  const quoteLines = quote.includes('\n') ? quote.split('\n') : [quote];
  
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8 leading-tight font-normal">
          "{quoteLines[0]}{quoteLines[1] ? <><br /> {quoteLines[1]}</> : ''}"
        </h2>
        
        <p className="text-lg text-gray-500 font-light leading-relaxed font-sans">
          {t('about.description')}
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
