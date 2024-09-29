import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleReferenceClick = (text) => {
    setInputValue(text);
    navigate(`/chat?autoInput=${encodeURIComponent(text)}`, { replace: true });
  };

  const handleBuildSite = () => {
    navigate('/projects');
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-gray-100 flex flex-col justify-between items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 animate-gradient-x"></div>
      <header className="w-full flex justify-between items-center p-6 relative z-10">
        <img 
          src="https://dopniceu5am9m.cloudfront.net/natural.ai/assets/svg/logo_white.svg" 
          alt="Imagica Logo" 
          className="w-16 h-auto"
        />
        <button 
          className="bg-white text-gray-900 px-4 py-2 rounded-full hover:bg-gray-200 transition duration-300"
          onClick={handleBuildSite}
        >
          Build your site
        </button>
      </header>
      <main className="text-center relative z-10">
        <h1 className="text-6xl font-bold mb-36 text-white">Magic Your Site Chat by Chat</h1>
        <div className={`bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 rounded-lg max-w-2xl mx-auto shadow-lg transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="mb-4 text-left text-gray-300 animate-fadeIn animation-delay-0">👋 I'm Imagica, what would you like to build today?</p>
          <input 
            type="text" 
            placeholder="Describe what Al app you would like to create..." 
            className="w-full p-2 rounded bg-gray-700 text-gray-100 mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400 animate-fadeIn animation-delay-100"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="text-left">
            <span className="text-gray-400 animate-fadeIn animation-delay-200">Reference::</span>
            <a 
              href="#" 
              className="block text-white hover:text-gray-300 hover:underline mt-2 animate-fadeIn animation-delay-300"
              onClick={() => handleReferenceClick("I need a travel Planner: I tell it where I want to go and how long my stay will be, and it will show me an image of my destination and then a day-by-day itinerary")}
            >
              Travel Planner: I tell it where I want to go and how long my stay will be, and it will show me an image of my destination and then a day-by-day itinerary
            </a>
            <a 
              href="#" 
              className="block text-white hover:text-gray-300 hover:underline mt-2 animate-fadeIn animation-delay-400"
              onClick={() => handleReferenceClick("I need a gift Recommender: I tell it the occasion, it gives me recommendations for gifts")}
            >
              Gift Recommender: I tell it the occasion, it gives me recommendations for gifts
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;