import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCountries, getAllPrograms } from '../constants/guideData';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (!user) {
        navigate('/login');
        return;
      }
      navigate(`/guides?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleGuideNavigation = (url) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(url);
  };

  const quickLinks = [
    {
      title: 'Study Guides',
      description: 'SOP & VISA guides for international students',
      icon: '📚',
      path: '/guides',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Universities',
      description: 'Explore top universities worldwide',
      icon: '🏫',
      path: '/universities',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Housing',
      description: 'Find student accommodation',
      icon: '🏠',
      path: '/housing',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Bookmarks',
      description: 'Your saved guides and resources',
      icon: '🔖',
      path: '/bookmarks',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  // Get study fields from guideData with icons
  const getStudyFieldsWithIcons = () => {
    const programs = getAllPrograms();
    const iconMap = {
      'Computer Science': '💻',
      'Electrical Engineering': '⚡',
      'Mechanical Engineering': '⚙️',
      'Aerospace Engineering': '🚀',
      'Chemical Engineering': '🧪',
      'Business Administration (MBA)': '💼',
      'Medicine': '⚕️',
      'Law': '⚖️',
      'Psychology': '🧠',
      'Economics': '📈',
      'Biology': '🧬',
      'Physics': '⚛️',
      'Mathematics': '📐',
      'Engineering': '🔧',
      'Architecture': '🏗️',
      'International Relations': '🌍',
      'Artificial Intelligence': '🤖',
      'Data Science': '📊',
      'Software Engineering': '💽',
      'Robotics': '🤖',
      'Statistics': '📊'
    };
    
    return programs.slice(0, 9).map(program => ({
      name: program,
      icon: iconMap[program] || '🎓'
    }));
  };

  const studyFields = getStudyFieldsWithIcons();

  // Get countries from guideData with additional info
  const getFeaturedCountries = () => {
    const countries = getCountries();
    const countryInfo = {
      'United States': {
        flag: '🇺🇸',
        universities: 'Harvard, MIT, Stanford, Carnegie Mellon',
        description: 'Top universities and diverse programs'
      },
      'United Kingdom': {
        flag: '🇬🇧',
        universities: 'Oxford, Cambridge',
        description: 'Historic institutions and research excellence'
      },
      'Canada': {
        flag: '🇨🇦',
        universities: 'Toronto, Waterloo',
        description: 'Quality education and immigration opportunities'
      },
      'Australia': {
        flag: '🇦🇺',
        universities: 'Melbourne, ANU',
        description: 'High living standards and work opportunities'
      }
    };

    return countries.map((country, index) => ({
      id: index + 1,
      name: country,
      flag: countryInfo[country]?.flag || '🌍',
      universities: countryInfo[country]?.universities || 'Top Universities',
      description: countryInfo[country]?.description || 'Quality education opportunities'
    }));
  };

  const featuredCountries = getFeaturedCountries();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="hero-section rounded-3xl p-12 relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent">
            <div className="absolute top-4 right-4 text-6xl opacity-20">
              🗽🏛️⛪🗼🏛️
            </div>
          </div>
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">✈️</span>
              <h1 className="text-5xl font-bold text-white">AbroadEase</h1>
            </div>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Your gateway to international education. Find the perfect university, get expert guidance, and make your study abroad dreams a reality.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-3 shadow-2xl">
              <div className="flex items-center">
                <span className="text-2xl ml-4">🔍</span>
                <input
                  type="text"
                  placeholder="Search for guides, universities, or programs..."
                  className="flex-1 border-none outline-none p-4 text-lg bg-transparent placeholder-gray-500 text-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Explore AbroadEase</h2>
            <p className="text-gray-600">Everything you need for your study abroad journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => {
              if (link.path === '/guides' || link.path === '/bookmarks') {
                return (
                  <div
                    key={link.path}
                    onClick={() => handleGuideNavigation(link.path)}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${link.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl text-white">{link.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {link.description}
                    </p>
                    {/* {!user && (
                      <p className="text-xs text-red-500 mt-2">Login required</p>
                    )} */}
                  </div>
                );
              }
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${link.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl text-white">{link.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {link.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Study Fields */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular Study Fields</h2>
            <p className="text-gray-600">Discover guides and resources for your field of interest</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {studyFields.map((field) => (
              <div
                key={field.name}
                onClick={() => handleGuideNavigation(`/guides?program=${encodeURIComponent(field.name)}`)}
                className="bg-white rounded-xl p-6 text-center hover:bg-blue-50 transition-all duration-300 hover:shadow-lg group cursor-pointer"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {field.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                  {field.name}
                </span>
               {/*  {!user && (
                  <p className="text-xs text-red-500 mt-1">Login required</p>
                )} */}
              </div>
            ))}
          </div>
        </div>

        {/* Featured Countries */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Top Study Destinations</h2>
            <p className="text-gray-600">Explore the most popular countries for international students</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCountries.map((country) => (
              <div
                key={country.id}
                onClick={() => handleGuideNavigation(`/guides?country=${encodeURIComponent(country.name)}`)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {country.flag}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {country.name}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    {country.universities}
                  </p>
                  <p className="text-sm text-gray-600">
                    {country.description}
                  </p>
                  {/* {!user && (
                    <p className="text-xs text-red-500 mt-2">Login required</p>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of students who have successfully studied abroad with AbroadEase
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleGuideNavigation('/guides')}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Study Guides
            </button>
            <Link
              to="/universities"
              className="border-2 border-white !text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Explore Universities
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
