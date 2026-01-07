import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArtCard from '../components/ArtCard';
import { useTranslation } from '../hooks/useTranslation';
import { api } from '../services/api';

const Gallery = () => {
  const { t } = useTranslation();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categoryMap = {
    'All': t('gallery.categories.all'),
    'Landscape': t('gallery.categories.landscape'),
    'Portrait': t('gallery.categories.portrait'),
    'Abstract': t('gallery.categories.abstract'),
  };

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const arts = await api.artworks.getAll({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined,
          sort: sortOption,
        });
        setArtworks(arts);
      } catch (error) {
        console.error('Error fetching artworks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [selectedCategory, sortOption, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">{t('gallery.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-light text-gray-900 mb-8 text-center">
          {t('gallery.title')}
        </h1>

        <div className="flex flex-col gap-4 mb-10">
          <div className="w-full md:max-w-md mx-auto">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.5 3a5.5 5.5 0 103.473 9.8l3.863 3.864a.75.75 0 101.06-1.06l-3.864-3.863A5.5 5.5 0 008.5 3zM5 8.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('gallery.searchPlaceholder')}
                className="w-full rounded-none border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {['All', 'Landscape', 'Portrait', 'Abstract'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm border transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {categoryMap[category]}
                </button>
              ))}
            </div>

            <div>
              <label className="mr-3 text-sm text-gray-700">{t('gallery.sortBy')}</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-3 py-2 border border-gray-300 bg-white text-sm focus:outline-none focus:border-gray-900"
              >
                <option value="newest">{t('gallery.sortOptions.newest')}</option>
                <option value="priceLowHigh">{t('gallery.sortOptions.priceLowHigh')}</option>
                <option value="priceHighLow">{t('gallery.sortOptions.priceHighLow')}</option>
              </select>
            </div>
          </div>
        </div>

        {artworks.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-600 mb-4">{t('gallery.noArtworks')}</p>
            <p className="text-sm text-gray-500">{t('gallery.checkBack')}</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {artworks.map((art) => (
              <Link
                key={art.id}
                to={`/artwork/${art.id}`}
                className="block break-inside-avoid mb-4 hover:no-underline"
              >
                <ArtCard art={art} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;

