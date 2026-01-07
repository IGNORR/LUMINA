const FeaturedCarousel = () => {
  const featuredArtworks = [
    {
      id: 1,
      title: "Abstract Harmony",
      price: 2500,
      image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Ocean Dreams",
      price: 3200,
      image: "https://images.unsplash.com/photo-1579009420909-b837eefa4274?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Urban Reflections",
      price: 2800,
      image: "https://images.unsplash.com/photo-1549887552-93f8efb871ed?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Serene Landscape",
      price: 4500,
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Color Symphony",
      price: 3800,
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-serif text-center text-gray-900 mb-12 font-normal">
          Curator's Picks
        </h2>

        <div className="relative">
          <div 
            className="flex gap-20 md:gap-24 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {featuredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="flex-shrink-0 w-40 md:w-48 snap-start"
              >
                <div className="relative h-[300px] md:h-[350px] group">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover rounded-none"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-2xl font-serif text-white mb-2 font-normal">
                      {artwork.title}
                    </h3>
                    <p className="text-xl text-white font-light">
                      ${artwork.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarousel;

