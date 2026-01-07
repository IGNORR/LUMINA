import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../hooks/useTranslation';
import { api } from '../services/api';

const ArtworkDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { addToCart, cart } = useCart();
  
  const isInCart = artwork ? cart.some((item) => item.id === artwork.id) : false;
  
  const categoryMap = {
    'Landscape': t('gallery.categories.landscape'),
    'Portrait': t('gallery.categories.portrait'),
    'Abstract': t('gallery.categories.abstract'),
  };

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const art = await api.artworks.getById(id);
        setArtwork(art);
      } catch (error) {
        console.error('Error fetching artwork:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">{t('artwork.loading')}</p>
      </div>
    );
  }

  if (notFound || !artwork) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-700">{t('artwork.notFound')}</p>
          <Link
            to="/gallery"
            className="inline-block px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300"
          >
            {t('artwork.backToGallery')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/gallery"
            className="inline-block px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300"
          >
            {t('artwork.backToGallery')}
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div className="bg-gray-100 flex items-center justify-center relative">
            {artwork.imageUrl ? (
              <>
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className={`w-full h-auto object-contain ${artwork.sold ? 'opacity-60' : ''}`}
                />
                {artwork.sold && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 text-lg font-semibold uppercase tracking-wide">
                    {t('artwork.sold')}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 py-24">
                {t('artwork.noImage')}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-2">{artwork.title}</h1>
              {artwork.artist && (
                <h2 className="text-xl text-gray-700">{artwork.artist}</h2>
              )}
            </div>

            <div className="text-3xl text-gray-900">
              {artwork.price !== undefined && artwork.price !== null
                ? `$${Number(artwork.price).toLocaleString()}`
                : t('artwork.priceOnRequest')}
            </div>

            {artwork.category && (
              <div className="inline-block px-3 py-1 border border-gray-300 text-sm text-gray-700">
                {categoryMap[artwork.category] || artwork.category}
              </div>
            )}

            {artwork.sold ? (
              <div className="space-y-2">
                <button
                  disabled
                  className="px-6 py-3 bg-gray-400 text-white cursor-not-allowed transition-colors duration-300"
                >
                  {t('artwork.soldOut')}
                </button>
                <p className="text-sm text-gray-600">{t('artwork.soldMessage')}</p>
              </div>
            ) : isInCart ? (
              <button
                disabled
                className="px-6 py-3 bg-blue-500 text-white cursor-not-allowed transition-colors duration-300"
              >
                {t('artwork.inCart')}
              </button>
            ) : (
              <button
                className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-300"
                onClick={() => {
                  addToCart({
                    id: artwork.id,
                    title: artwork.title,
                    artist: artwork.artist,
                    price: artwork.price,
                    category: artwork.category,
                    imageUrl: artwork.imageUrl,
                    sold: artwork.sold,
                  });
                }}
              >
                {t('artwork.addToCart')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetails;


