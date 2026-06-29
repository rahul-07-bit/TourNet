import React, { useState } from 'react';

// Curated 20 Indian Tourism Destinations across all 8 categories
const INDIAN_DESTINATIONS = [
  // Spiritual India
  {
    id: 'ind-varanasi',
    name: 'Sacred Ganga Aarti',
    location: 'VARANASI, UP',
    rating: 4.95,
    category: 'Spiritual India',
    glowColor: 'text-orange-400 border-orange-400/30',
    tag: 'Spiritual',
    image: '/ganga_aarti.png',
    description: 'Witness the hyper-realistic evening Ganga Aarti. Priests with fiery brass lamps, smoke particles, and floating diyas reflecting on the sacred river.',
    safetyScore: '9.8/10',
    crowdLevel: 'High',
    ambientSpec: 'Spiritual Vibe: Intense'
  },
  {
    id: 'ind-rishikesh-spirit',
    name: 'River of Peace',
    location: 'RISHIKESH, INDIA',
    rating: 4.87,
    category: 'Spiritual India',
    glowColor: 'text-teal-400 border-teal-400/30',
    tag: 'Spiritual',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    description: 'White-water river rafting along the holy Ganges. Himalayan river breezes mixed with spiritual yoga vibes and glowing bridge lights.',
    safetyScore: '9.8/10',
    crowdLevel: 'Moderate',
    ambientSpec: 'Vibe: Meditative'
  },
  
  // Mountains & Himalayas
  {
    id: 'ind-ladakh',
    name: 'Himalayan Beyond',
    location: 'LADAKH, INDIA',
    rating: 4.88,
    category: 'Mountains & Himalayas',
    glowColor: 'text-blue-400 border-blue-400/30',
    tag: 'Adventure',
    image: '/ladakh_mountains.png',
    description: 'Majestic snow mountains, ancient monasteries, moving white clouds, and a cold cinematic blue atmosphere of high altitude.',
    safetyScore: '9.9/10',
    crowdLevel: 'Low',
    ambientSpec: 'Altitude: 3,500m'
  },
  {
    id: 'ind-kashmir',
    name: 'Heaven on Earth',
    location: 'KASHMIR, INDIA',
    rating: 4.92,
    category: 'Mountains & Himalayas',
    glowColor: 'text-cyan-400 border-cyan-400/30',
    tag: 'Scenic',
    image: '/kashmir.png',
    description: 'Drifting Shikara wooden boats on Dal Lake. Layered snow mountains rising above a soft, foggy cinematic lake atmosphere.',
    safetyScore: '9.2/10',
    crowdLevel: 'Moderate',
    ambientSpec: 'Climate: Freezing'
  },

  // Royal Heritage
  {
    id: 'ind-jaipur',
    name: 'Royal Saffron Nights',
    location: 'JAIPUR, RAJASTHAN',
    rating: 4.82,
    category: 'Royal Heritage',
    glowColor: 'text-amber-400 border-amber-400/30',
    tag: 'Heritage',
    image: '/jaipur_palace.png',
    description: 'The golden arches of Amber Fort illuminated with warm palace lights. Traditional heritage architecture wrapped in a warm golden glow.',
    safetyScore: '9.4/10',
    crowdLevel: 'Moderate',
    ambientSpec: 'Vibe: Royal Elegance'
  },

  // Beaches & Islands
  {
    id: 'ind-goa',
    name: 'Sunset Beach Bliss',
    location: 'GOA, INDIA',
    rating: 4.79,
    category: 'Beaches & Islands',
    glowColor: 'text-rose-400 border-rose-400/30',
    tag: 'Tropical',
    image: '/goa_sunset.png',
    description: 'Golden sandy beaches framed by swaying palms. Immersive sunset glow and luxury tropical beach vibes with ocean light reflections.',
    safetyScore: '9.5/10',
    crowdLevel: 'Moderate',
    ambientSpec: 'Vibe: Leisure Sunset'
  },
  {
    id: 'ind-andaman',
    name: 'Crystal Island Escape',
    location: 'ANDAMAN, INDIA',
    rating: 4.89,
    category: 'Beaches & Islands',
    glowColor: 'text-sky-400 border-sky-400/30',
    tag: 'Island',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
    description: 'Immaculate white beaches and pure blue ocean water. Deep underwater diving visuals with exotic coral reefs and marine life.',
    safetyScore: '9.9/10',
    crowdLevel: 'Low',
    ambientSpec: 'Marine Life: Abundant'
  },

  // Forest & Wildlife
  {
    id: 'ind-meghalaya-forest',
    name: 'Living Root Mysteries',
    location: 'MEGHALAYA, INDIA',
    rating: 4.81,
    category: 'Forest & Wildlife',
    glowColor: 'text-green-400 border-green-400/30',
    tag: 'Nature',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    description: 'Mist-shrouded rainforest valleys, rushing waterfalls, and ancient living root bridges woven together by nature particles and fog.',
    safetyScore: '9.6/10',
    crowdLevel: 'Low',
    ambientSpec: 'Rainfall: High'
  },

  // Hidden Gems
  {
    id: 'ind-kerala',
    name: 'Floating Backwater Dreams',
    location: 'KERALA, INDIA',
    rating: 4.85,
    category: 'Hidden Gems',
    glowColor: 'text-emerald-400 border-emerald-400/30',
    tag: 'Nature',
    image: '/kerala_backwaters.png',
    description: 'Tranquil houseboats moving slowly through coconut groves. Cinematic orange sunset reflections shimmering on calm backwaters.',
    safetyScore: '9.7/10',
    crowdLevel: 'Low',
    ambientSpec: 'Climate: Tropical'
  },
  {
    id: 'ind-hampi',
    name: 'Forgotten Stone Kingdom',
    location: 'HAMPI, INDIA',
    rating: 4.84,
    category: 'Hidden Gems',
    glowColor: 'text-orange-400 border-orange-400/30',
    tag: 'Heritage',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
    description: 'Eerie stone ruins and monolithic structures scattered across boulder hills, lit by an orange sunset and historical atmosphere.',
    safetyScore: '9.6/10',
    crowdLevel: 'Low',
    ambientSpec: 'Age: 600+ Years'
  },

  // Food Trails
  {
    id: 'ind-jaipur-food',
    name: 'Jaipur Street Food',
    location: 'JAIPUR, RAJASTHAN',
    rating: 4.81,
    category: 'Food Trails',
    glowColor: 'text-yellow-400 border-yellow-400/30',
    tag: 'Foodie',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80',
    description: 'Savor the rich tastes of spicy Pyaz Kachori, Mirchi Vadas, and sweet creamy Mawa Lassi in historic Johari Bazar alleys.',
    safetyScore: '9.5/10',
    crowdLevel: 'High',
    ambientSpec: 'Type: Spicy & Sweet'
  },
  {
    id: 'ind-lucknow-food',
    name: 'Lucknow Kebabs',
    location: 'LUCKNOW, UP',
    rating: 4.93,
    category: 'Food Trails',
    glowColor: 'text-red-400 border-red-400/30',
    tag: 'Heritage',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80',
    description: 'Experience the legendary, melt-in-the-mouth Awadhi Galouti Kebabs slow-cooked on glowing tawa charcoal grates.',
    safetyScore: '9.3/10',
    crowdLevel: 'Moderate',
    ambientSpec: 'Taste: Melt-in-mouth'
  },
  {
    id: 'ind-delhi-food',
    name: 'Delhi Chandni Chowk',
    location: 'OLD DELHI, INDIA',
    rating: 4.86,
    category: 'Food Trails',
    glowColor: 'text-amber-500 border-amber-500/30',
    tag: 'Foodie',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=1200&q=80',
    description: 'Explore the iconic Paranthe Wali Gali, sweet syrupy Jalebis, and flavorful spicy Chaat in Delhi’s oldest bazaars.',
    safetyScore: '9.0/10',
    crowdLevel: 'High',
    ambientSpec: 'Spiciness: Extreme'
  },
  {
    id: 'ind-amritsar-food',
    name: 'Amritsar Punjabi Cuisine',
    location: 'AMRITSAR, PUNJAB',
    rating: 4.91,
    category: 'Food Trails',
    glowColor: 'text-amber-400 border-amber-400/30',
    tag: 'Cultured',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80',
    description: 'Savor rich buttery Amritsari Kulcha, slow-simmered Maa ki Dal, and giant glasses of sweet Punjabi Lassi.',
    safetyScore: '9.8/10',
    crowdLevel: 'High',
    ambientSpec: 'Style: Butter Rich'
  },
  {
    id: 'ind-hyderabad-food',
    name: 'Hyderabad Biryani Trails',
    location: 'HYDERABAD, TELANGANA',
    rating: 4.96,
    category: 'Food Trails',
    glowColor: 'text-rose-400 border-rose-400/30',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    description: 'Savor authentic slow-cooked Hyderabadi Dum Biryani, layered with saffron-infused basmati rice and roasted spices.',
    safetyScore: '9.6/10',
    crowdLevel: 'Moderate',
    ambientSpec: 'Vibe: Nizam Luxury'
  },

  // Adventure Destinations
  {
    id: 'ind-ladakh-adv',
    name: 'Ladakh Bike Expedition',
    location: 'LEH-LADAKH, IN',
    rating: 4.94,
    category: 'Adventure Destinations',
    glowColor: 'text-blue-400 border-blue-400/30',
    tag: 'Extreme',
    image: 'https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?auto=format&fit=crop&w=1200&q=80',
    description: 'Ride high-altitude mountain passes like Khardung La, crossing desolate cold deserts and brilliant turquoise salt lakes.',
    safetyScore: '9.4/10',
    crowdLevel: 'Low',
    ambientSpec: 'Type: Motorcycle Route'
  },
  {
    id: 'ind-rishikesh-adv',
    name: 'Rishikesh River Rafting',
    location: 'RISHIKESH, UK',
    rating: 4.88,
    category: 'Adventure Destinations',
    glowColor: 'text-teal-400 border-teal-400/30',
    tag: 'Adventure',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    description: 'Conquer the Grade III and IV rapids of the Ganges, carving through rocky Himalayan canyons and pine valleys.',
    safetyScore: '9.6/10',
    crowdLevel: 'Moderate',
    ambientSpec: 'Water Temp: Cold'
  },
  {
    id: 'ind-meghalaya-adv',
    name: 'Meghalaya Cave Exploration',
    location: 'CHERRAPUNJI, INDIA',
    rating: 4.82,
    category: 'Adventure Destinations',
    glowColor: 'text-emerald-400 border-emerald-400/30',
    tag: 'Extreme',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    description: 'Crawl through deep limestone caverns, exploring fossil records and mysterious underground rivers in Mawsmai Caves.',
    safetyScore: '9.1/10',
    crowdLevel: 'Low',
    ambientSpec: 'Terrain: Underground'
  },
  {
    id: 'ind-spiti-adv',
    name: 'Spiti Valley Road Trip',
    location: 'SPITI VALLEY, HP',
    rating: 4.91,
    category: 'Adventure Destinations',
    glowColor: 'text-indigo-400 border-indigo-400/30',
    tag: 'Scenic',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    description: 'Expedition through rugged, unpaved high passes, visiting ancient monasteries perched on extreme rocky cliffs.',
    safetyScore: '9.3/10',
    crowdLevel: 'Low',
    ambientSpec: 'Pass altitude: 4,000m+'
  },
  {
    id: 'ind-manali-adv',
    name: 'Manali Snow Adventure',
    location: 'MANALI, HP',
    rating: 4.85,
    category: 'Adventure Destinations',
    glowColor: 'text-cyan-400 border-cyan-400/30',
    tag: 'Adventure',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    description: 'Ski Solang Valley slopes, try paragliding over snowfields, or trek to high altitude glacial lakes in winter.',
    safetyScore: '9.5/10',
    crowdLevel: 'High',
    ambientSpec: 'Snow Cover: Thick'
  }
];

const CATEGORIES = [
  'All',
  'Spiritual India',
  'Mountains & Himalayas',
  'Royal Heritage',
  'Beaches & Islands',
  'Forest & Wildlife',
  'Hidden Gems',
  'Food Trails',
  'Adventure Destinations'
];

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarked, setBookmarked] = useState({});
  const [selectedDest, setSelectedDest] = useState(null);

  // Toggle bookmark function
  const handleBookmarkToggle = (e, id) => {
    e.stopPropagation();
    setBookmarked((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter logic
  const getFilteredDestinations = () => {
    return INDIAN_DESTINATIONS.filter((dest) => {
      const matchesSearch =
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || dest.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredList = getFilteredDestinations();

  return (
    <section className="animate-fade-in-up px-container-margin pt-20">
      
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-headline-md font-headline-md text-white tracking-tight">
          Explore India
        </h2>
        <p className="text-[12px] text-on-surface-variant/70 mt-1">
          Journey through India's sacred temples, royal palaces, mountains, and tropical coasts
        </p>
      </div>

      {/* Dynamic Search Box */}
      <div className="relative mb-6">
        <div className="glass rounded-2xl p-1.5 flex items-center gap-2 border border-white/10 focus-within:border-primary/45 transition-colors duration-200">
          <span className="material-symbols-outlined text-on-surface-variant/60 ml-3" data-icon="search">search</span>
          <input
            type="text"
            placeholder="Search by state, city, or temple..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 w-full text-body-md placeholder:text-on-surface-variant/40 text-white outline-none py-2"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="p-1 hover:bg-white/10 rounded-full text-on-surface-variant/60 mr-1"
            >
              <span className="material-symbols-outlined text-[20px]" data-icon="close">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories Horizontal Scroll Chips */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-4 -mx-container-margin px-container-margin scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-label-md font-bold transition-all duration-200 border ${
                isActive
                  ? 'bg-primary-container/20 text-primary border-primary-container/30 shadow-[0_0_12px_rgba(255,153,51,0.2)]'
                  : 'glass text-on-surface-variant/75 border-white/5 hover:border-white/15 hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Destination Grid with dynamic key-based entry transitions */}
      <div key={activeCategory} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 animate-fade-in-up">
        {filteredList.map((dest) => {
          const isBookmarked = bookmarked[dest.id];
          return (
            <div
              key={dest.id}
              onClick={() => setSelectedDest(dest)}
              className="glass rounded-3xl overflow-hidden border border-white/10 flex flex-col md:flex-row h-auto md:h-52 group cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:border-primary-fixed-dim/20 shadow-lg"
            >
              {/* Image side */}
              <div className="w-full md:w-44 h-48 md:h-full relative overflow-hidden flex-shrink-0">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 card-gradient-overlay opacity-60"></div>
                
                {/* Location Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 glass px-2 py-0.5 rounded-full border border-white/10">
                  <span className="material-symbols-outlined text-[12px] text-primary" data-icon="location_on">location_on</span>
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest">{dest.location.split(',')[0]}</span>
                </div>
              </div>

              {/* Text info side */}
              <div className="p-5 flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="font-semibold text-white group-hover:text-primary transition-colors text-[18px] leading-snug truncate">
                      {dest.name}
                    </h4>
                    
                    {/* Bookmark Toggle */}
                    <button
                      onClick={(e) => handleBookmarkToggle(e, dest.id)}
                      className={`w-7.5 h-7.5 rounded-full flex items-center justify-center border transition-all duration-200 flex-shrink-0 ${
                        isBookmarked
                          ? 'bg-primary-container text-on-primary-container border-transparent shadow-[0_0_8px_rgba(255,153,51,0.4)]'
                          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]" style={{fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0"}}>bookmark</span>
                    </button>
                  </div>
                  
                  <p className="text-[10px] uppercase font-extrabold tracking-widest text-primary/75 mb-2">
                    {dest.category}
                  </p>
                  
                  {/* Glowing small description */}
                  <p className="text-on-surface-variant/80 text-[12px] line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>
                </div>

                {/* Bottom specs and CTA */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-secondary" data-icon="verified_user">verified_user</span>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{dest.safetyScore} Safety</span>
                  </div>
                  
                  <button className="bg-primary-container/10 text-primary group-hover:bg-primary-container group-hover:text-on-primary-container border border-primary/20 group-hover:border-transparent px-4.5 py-1.5 rounded-xl text-label-md font-bold transition-all duration-300 active:scale-95 flex items-center gap-1">
                    Explore Now
                    <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform" data-icon="arrow_forward">arrow_forward</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Cinematic Modal details for Indian Destinations */}
      {selectedDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass rounded-3xl overflow-hidden border border-white/15 animate-fade-in-up shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            
            {/* Header Image */}
            <div className="h-60 relative">
              <img
                src={selectedDest.image}
                alt={selectedDest.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 card-gradient-overlay"></div>
              
              {/* Close */}
              <button
                onClick={() => setSelectedDest(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-black/50 text-white hover:bg-black/80 hover:scale-105 rounded-full flex items-center justify-center transition-all border border-white/10"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              {/* Title Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-primary/30 bg-black/50 text-primary">
                  {selectedDest.category}
                </span>
                <h3 className="text-headline-sm font-headline-sm text-white mt-2 leading-tight">
                  {selectedDest.name}
                </h3>
                <div className="flex items-center gap-1.5 text-on-surface-variant/90 mt-1">
                  <span className="material-symbols-outlined text-[16px] text-primary" data-icon="location_on">location_on</span>
                  <span className="text-[12px] font-semibold">{selectedDest.location}</span>
                </div>
              </div>
            </div>

            {/* Modal Specs & Description */}
            <div className="p-6 space-y-5 text-left">
              
              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-3 py-3 px-4 glass rounded-2xl border-white/5">
                <div className="text-center">
                  <p className="text-[9px] text-on-surface-variant/60 uppercase font-bold">Safety Index</p>
                  <div className="flex items-center justify-center gap-1 mt-1 text-secondary">
                    <span className="material-symbols-outlined text-[14px]">verified_user</span>
                    <span className="text-[13px] font-bold">{selectedDest.safetyScore}</span>
                  </div>
                </div>
                <div className="text-center border-x border-white/10">
                  <p className="text-[9px] text-on-surface-variant/60 uppercase font-bold">Crowd Level</p>
                  <div className="flex items-center justify-center gap-1 mt-1 text-cyan-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span className="text-[13px] font-bold">{selectedDest.crowdLevel}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-on-surface-variant/60 uppercase font-bold">Ambient factor</p>
                  <p className="text-[11px] font-bold text-amber-400 mt-1.5 truncate">
                    {selectedDest.ambientSpec.split(':')[1] || selectedDest.ambientSpec}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-[12px] font-bold uppercase text-primary tracking-wider mb-1.5">Description</h4>
                <p className="text-on-surface-variant text-[14px] leading-relaxed">
                  {selectedDest.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-2">
                <button
                  onClick={(e) => handleBookmarkToggle(e, selectedDest.id)}
                  className={`px-4 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                    bookmarked[selectedDest.id]
                      ? 'bg-primary-container/20 text-primary border-primary-container/30 shadow-[0_0_12px_rgba(255,153,51,0.2)]'
                      : 'glass text-white/80 border-white/10 hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: bookmarked[selectedDest.id] ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
                </button>
                
                <button
                  onClick={() => {
                    alert(`Routing generated for ${selectedDest.name}! 🗺️`);
                    setSelectedDest(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-primary-container to-amber-500 text-on-primary-container py-3 rounded-xl font-bold hover:brightness-110 active:scale-95 shadow-[0_4px_15px_rgba(255,153,51,0.35)] transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">map</span>
                  Plan Safe Journey
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
