const ArtCard = ({ art }) => {
  const isSold = art.sold === true;

  return (
    <div className={`bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 ${isSold ? 'opacity-75' : ''}`}>
      <div className="bg-gray-100 relative">
        {art.imageUrl ? (
          <>
            <img
              src={art.imageUrl}
              alt={art.title}
              className={`w-full h-auto object-contain ${isSold ? 'opacity-60' : ''}`}
            />
            {isSold && (
              <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 text-sm font-semibold uppercase tracking-wide">
                SOLD
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 py-16">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-light text-gray-900 mb-1">{art.title}</h3>
        {art.artist && (
          <p className="text-sm text-gray-600 mb-2">{art.artist}</p>
        )}
        {art.year && (
          <p className="text-xs text-gray-500">{art.year}</p>
        )}
      </div>
    </div>
  );
};

export default ArtCard;

