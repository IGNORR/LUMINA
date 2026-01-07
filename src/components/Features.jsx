import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const Features = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      title: t('features.authenticity.title'),
      description: t('features.authenticity.description'),
      image: '/feature-auth.jpg',
      imageAlt: 'Close-up of artistic texture',
      reverse: false,
    },
    {
      title: t('features.shipping.title'),
      description: t('features.shipping.description'),
      image: '/feature-shipping.webp',
      imageAlt: 'Secure packaging',
      reverse: true,
    },
    {
      title: t('features.curation.title'),
      description: t('features.curation.description'),
      image: '/feature-experts.jpg',
      imageAlt: 'Art gallery wall',
      reverse: false,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              feature.reverse ? 'md:flex-row-reverse' : 'md:flex-row'
            } items-center gap-12 mb-24 last:mb-0`}
          >
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 shadow-lg group">
                <img
                  src={feature.image}
                  alt={feature.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-none"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h3 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 font-normal">
                {feature.title}
              </h3>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-sans">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
