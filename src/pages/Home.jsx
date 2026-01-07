import Hero from '../components/Hero';
import LatestArrivals from '../components/LatestArrivals';
import Features from '../components/Features';
import AboutSection from '../components/AboutSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />

      <LatestArrivals />

      <AboutSection />

      <Features />
    </div>
  );
};

export default Home;
