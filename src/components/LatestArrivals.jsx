import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ArtCard from './ArtCard';
import { useTranslation } from '../hooks/useTranslation';
import { api } from '../services/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const LatestArrivals = () => {
  const { t } = useTranslation();
  const [latestArt, setLatestArt] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const arts = await api.artworks.getLatest(7);
        setLatestArt(arts);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading || latestArt.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 font-normal">{t('latestArrivals.title')}</h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-sans">{t('latestArrivals.subtitle')}</p>
        </div>

        <div className="relative px-4 md:px-12">
          <div className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer p-2 text-gray-400 hover:text-black transition hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </div>
          <div className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer p-2 text-gray-400 hover:text-black transition hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <Swiper
            modules={[Navigation, A11y, Autoplay]}
            spaceBetween={20}
            slidesPerView={'auto'}
            centeredSlides={true}
            loop={latestArt.length > 3} // Only loop if enough items
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            breakpoints={{
              320: { spaceBetween: 30 },
              640: { spaceBetween: 40 },
              1024: { spaceBetween: 48 },
            }}
            className="!overflow-visible py-4" // Allow slides to overflow container
          >
            {latestArt.map((art) => (
              <SwiperSlide key={art.id} className="!w-[40%] sm:!w-[30%] md:!w-[40%] lg:!w-[40%] transition-all duration-500 ease-out">
                {({ isActive }) => (
                  <div className={`transition-all duration-500 ${isActive ? 'scale-100 opacity-100 z-10 shadow-xl' : 'scale-95 opacity-40 hover:opacity-70'}`}>
                    <Link to={`/artwork/${art.id}`} className="block h-full">
                      <ArtCard art={art} />
                    </Link>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default LatestArrivals;
