import React, { useEffect, useMemo, useState } from 'react';

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

const DESTINATION_CONTEXT = {
  'ind-varanasi': {
    coordinates: { lat: 25.3176, lon: 82.9739 },
    country: 'UP',
    peakCrowdTime: '6:30 PM - 8:00 PM',
    crowdWindowLabel: 'Evening Aarti',
    healthRisk: { name: 'Acute Respiratory Infections (ARIs)', level: 'Moderate Risk', cases: 'High' },
    interestingPoints: [
      'One of the oldest spiritual rituals in India, performed daily since centuries.',
      'Thousands of diyas are offered to Maa Ganga every evening.',
      'Chants, bells, and Vedic hymns create a mesmerizing atmosphere.',
      'Best place for photography - lights, fire, river & devotion together.',
      'Believed to cleanse sins and bring peace, prosperity & good karma.'
    ]
  },
  'ind-rishikesh-spirit': {
    coordinates: { lat: 30.0869, lon: 78.2676 },
    country: 'India',
    peakCrowdTime: '7:00 AM - 11:00 AM and sunset near the ghats',
    healthRisk: { name: 'River exposure and minor injury risk', level: 'Low to Moderate' },
    interestingPoints: [
      'Yoga centers and ghats are busiest around sunrise.',
      'Laxman Jhula and Ram Jhula areas get compact foot traffic.',
      'River activities should be booked with licensed operators.'
    ]
  },
  'ind-ladakh': {
    coordinates: { lat: 34.1526, lon: 77.5771 },
    country: 'India',
    peakCrowdTime: '10:00 AM - 3:00 PM in peak summer months',
    healthRisk: { name: 'Altitude sickness risk', level: 'High' },
    interestingPoints: [
      'Acclimatization in Leh is important before high-pass travel.',
      'Weather can shift quickly even on clear days.',
      'Remote routes may have limited mobile network and medical access.'
    ]
  },
  'ind-kashmir': {
    coordinates: { lat: 34.0837, lon: 74.7973 },
    country: 'India',
    peakCrowdTime: '11:00 AM - 5:00 PM around lakefront and gardens',
    healthRisk: { name: 'Cold exposure and respiratory irritation risk', level: 'Moderate' },
    interestingPoints: [
      'Dal Lake shikara points are busiest from late morning onward.',
      'Layered clothing helps with sharp temperature changes.',
      'Check local advisories before inter-district travel.'
    ]
  },
  'ind-jaipur': {
    coordinates: { lat: 26.9124, lon: 75.7873 },
    country: 'India',
    peakCrowdTime: '10:00 AM - 4:00 PM at forts and palaces',
    healthRisk: { name: 'Heat exhaustion and dehydration risk', level: 'Moderate' },
    interestingPoints: [
      'Amber Fort queues rise sharply after mid-morning.',
      'The old city is easier to explore early or near closing hours.',
      'Carry water during hot, dry months.'
    ]
  },
  'ind-goa': {
    coordinates: { lat: 15.2993, lon: 74.1240 },
    country: 'India',
    peakCrowdTime: '4:00 PM - 9:00 PM near beaches and nightlife zones',
    healthRisk: { name: 'Sunburn, dehydration, and mosquito-borne illness risk', level: 'Moderate' },
    interestingPoints: [
      'Beach roads become slow around sunset.',
      'Lifeguarded beaches are safer for swimming.',
      'Mosquito protection is useful after rain and at dusk.'
    ]
  },
  'ind-andaman': {
    coordinates: { lat: 11.7401, lon: 92.6586 },
    country: 'India',
    peakCrowdTime: '9:00 AM - 2:00 PM around ferries and beach activity slots',
    healthRisk: { name: 'Sun exposure and water activity risk', level: 'Moderate' },
    interestingPoints: [
      'Ferry schedules strongly shape crowd flow.',
      'Dive and snorkel visibility is usually best earlier in the day.',
      'Reef-safe sunscreen helps protect marine areas.'
    ]
  },
  'ind-meghalaya-forest': {
    coordinates: { lat: 25.5788, lon: 91.8933 },
    country: 'India',
    peakCrowdTime: '10:00 AM - 3:00 PM near waterfalls and root bridges',
    healthRisk: { name: 'Leech bites, slips, and monsoon infection risk', level: 'Moderate' },
    interestingPoints: [
      'Trails can become slick after sudden rain.',
      'Living root bridge walks involve many steps and uneven paths.',
      'Waterproof footwear is useful through most of the year.'
    ]
  },
  'ind-kerala': {
    coordinates: { lat: 9.4981, lon: 76.3388 },
    country: 'India',
    peakCrowdTime: '3:00 PM - 7:00 PM around houseboat check-ins and sunset',
    healthRisk: { name: 'Mosquito-borne illness risk', level: 'Moderate' },
    interestingPoints: [
      'Backwater routes are calmest in the morning.',
      'Houseboat boarding points bunch up before sunset cruises.',
      'Repellent is useful near canals and paddy areas.'
    ]
  },
  'ind-hampi': {
    coordinates: { lat: 15.3350, lon: 76.4600 },
    country: 'India',
    peakCrowdTime: '8:00 AM - 12:00 PM at temple ruins',
    healthRisk: { name: 'Heat exhaustion and dehydration risk', level: 'Moderate' },
    interestingPoints: [
      'The boulder landscape has limited shade in midday heat.',
      'Sunrise and sunset are the most comfortable viewing windows.',
      'Many ruins require walking over uneven stone surfaces.'
    ]
  },
  'ind-jaipur-food': {
    coordinates: { lat: 26.9239, lon: 75.8267 },
    country: 'India',
    peakCrowdTime: '5:00 PM - 9:00 PM in old-city food markets',
    healthRisk: { name: 'Street-food stomach upset risk', level: 'Moderate' },
    interestingPoints: [
      'Johari Bazar and nearby lanes are most active after work hours.',
      'Choose busy stalls with fast turnover.',
      'Spice and heat can be intense in summer.'
    ]
  },
  'ind-lucknow-food': {
    coordinates: { lat: 26.8467, lon: 80.9462 },
    country: 'India',
    peakCrowdTime: '7:00 PM - 10:00 PM in old Lucknow food lanes',
    healthRisk: { name: 'Street-food stomach upset risk', level: 'Moderate' },
    interestingPoints: [
      'Tunday Kababi and Aminabad lanes get dense at dinner time.',
      'Late evenings have the liveliest food-trail atmosphere.',
      'Keep small cash handy for older market lanes.'
    ]
  },
  'ind-delhi-food': {
    coordinates: { lat: 28.6506, lon: 77.2303 },
    country: 'India',
    peakCrowdTime: '12:00 PM - 4:00 PM and 6:00 PM - 9:00 PM',
    healthRisk: { name: 'Air pollution and street-food stomach upset risk', level: 'Moderate to High' },
    interestingPoints: [
      'Chandni Chowk is dense around lunch and evening snack hours.',
      'Metro access is usually easier than driving into the market.',
      'People sensitive to air quality should check AQI before visiting.'
    ]
  },
  'ind-amritsar-food': {
    coordinates: { lat: 31.6340, lon: 74.8723 },
    country: 'India',
    peakCrowdTime: '8:00 AM - 11:00 AM and 6:00 PM - 9:00 PM',
    healthRisk: { name: 'Rich-food digestive discomfort risk', level: 'Low to Moderate' },
    interestingPoints: [
      'Breakfast kulcha shops get busy early.',
      'Golden Temple area footfall affects nearby food lanes.',
      'Hydrate well when moving between markets in warm weather.'
    ]
  },
  'ind-hyderabad-food': {
    coordinates: { lat: 17.3616, lon: 78.4747 },
    country: 'India',
    peakCrowdTime: '1:00 PM - 3:00 PM and 8:00 PM - 11:00 PM',
    healthRisk: { name: 'Spicy-food stomach irritation risk', level: 'Low to Moderate' },
    interestingPoints: [
      'Old-city biryani spots peak at lunch and late dinner.',
      'Traffic around Charminar can slow sharply in the evening.',
      'Plan extra time between food stops.'
    ]
  },
  'ind-ladakh-adv': {
    coordinates: { lat: 34.1642, lon: 77.5848 },
    country: 'India',
    peakCrowdTime: '8:00 AM - 2:00 PM on major pass routes',
    healthRisk: { name: 'Altitude sickness and cold exposure risk', level: 'High' },
    interestingPoints: [
      'High passes can close quickly due to weather.',
      'Buffer days help with acclimatization and road delays.',
      'Fuel and repair stops are sparse outside main towns.'
    ]
  },
  'ind-rishikesh-adv': {
    coordinates: { lat: 30.1087, lon: 78.2948 },
    country: 'India',
    peakCrowdTime: '9:00 AM - 1:00 PM during rafting departures',
    healthRisk: { name: 'Water activity injury risk', level: 'Moderate' },
    interestingPoints: [
      'Rafting batches cluster in the morning.',
      'Certified guides and helmets are essential on rapids.',
      'River levels vary by season and rainfall.'
    ]
  },
  'ind-meghalaya-adv': {
    coordinates: { lat: 25.2843, lon: 91.7256 },
    country: 'India',
    peakCrowdTime: '10:00 AM - 2:00 PM at cave entry points',
    healthRisk: { name: 'Slips, low-light injury, and damp-cave infection risk', level: 'Moderate' },
    interestingPoints: [
      'Caves can be wet and narrow in sections.',
      'Guided entry is safer for unfamiliar routes.',
      'Carry a headlamp even for popular cave systems.'
    ]
  },
  'ind-spiti-adv': {
    coordinates: { lat: 32.2461, lon: 78.0172 },
    country: 'India',
    peakCrowdTime: '9:00 AM - 3:00 PM along monastery and pass routes',
    healthRisk: { name: 'Altitude sickness and road fatigue risk', level: 'High' },
    interestingPoints: [
      'Distances take longer than maps suggest because roads are rough.',
      'Remote stretches have limited fuel, food, and medical support.',
      'Acclimatization matters before sleeping at higher villages.'
    ]
  },
  'ind-manali-adv': {
    coordinates: { lat: 32.2432, lon: 77.1892 },
    country: 'India',
    peakCrowdTime: '10:00 AM - 4:00 PM around Solang Valley and mall road',
    healthRisk: { name: 'Cold exposure and snow-sport injury risk', level: 'Moderate' },
    interestingPoints: [
      'Adventure zones are busiest after breakfast.',
      'Snow activities need proper boots and trained operators.',
      'Traffic toward Solang can build quickly in holiday periods.'
    ]
  }
};

const WEATHER_CODES = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm'
};

const toRadians = (degrees) => (degrees * Math.PI) / 180;

const getDistanceKm = (from, to) => {
  if (!from || !to) return null;
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return Math.round(earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const getDestinationDetails = (destination) => ({
  ...destination,
  ...(DESTINATION_CONTEXT[destination.id] || {})
});

// ─── Crowd bar chart: derives time window from peakCrowdTime string ───────────
function buildCrowdBars(peakCrowdTime) {
  // Attempt to parse the first time in the peakCrowdTime string (e.g. "6:30 PM - 8:00 PM")
  if (!peakCrowdTime) return { bars: [], labels: [] };

  // Generic 24-slot bar profile (midnight → 11 PM, 30-min buckets)
  // peaks at whatever hour range is specified
  const parseHour = (str) => {
    const match = str.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
    if (!match) return null;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2] || '0', 10);
    const period = match[3].toUpperCase();
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h + m / 60;
  };

  // Extract start/end hours from the string
  const timeMatches = peakCrowdTime.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM))/gi) || [];
  const startHour = timeMatches[0] ? parseHour(timeMatches[0]) : null;
  const endHour   = timeMatches[1] ? parseHour(timeMatches[1]) : null;

  // Build 8 bars across a 4-hour window centred on the peak
  const windowStart = startHour !== null ? Math.max(0, startHour - 1) : 10;
  const windowEnd   = endHour   !== null ? Math.min(24, endHour   + 1) : 14;
  const step = (windowEnd - windowStart) / 8;

  const labels = [];
  const bars   = [];
  for (let i = 0; i < 8; i++) {
    const h = windowStart + i * step;
    const hour = Math.floor(h) % 24;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const h12  = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    labels.push(`${h12} ${ampm}`);

    // Height: ramp up to peak in the middle, fade after
    const relPos = i / 7; // 0 → 1 across the window
    // Bell-ish curve peaking between index 3 and 5
    const peakPos = 0.55;
    const spread  = 0.32;
    const gauss   = Math.exp(-Math.pow((relPos - peakPos) / spread, 2) / 2);
    bars.push(Math.round(18 + gauss * 82));
  }

  // Mark bars outside the true peak as dimmer (after the last label)
  const trueStartIdx = startHour !== null ? Math.round((startHour - windowStart) / step) : 2;
  const trueEndIdx   = endHour   !== null ? Math.round((endHour   - windowStart) / step) : 5;

  return { bars, labels, trueStartIdx: Math.max(0, trueStartIdx), trueEndIdx: Math.min(7, trueEndIdx) };
}

function CrowdBars({ peakCrowdTime }) {
  const { bars, labels, trueStartIdx, trueEndIdx } = buildCrowdBars(peakCrowdTime);

  if (!bars.length) {
    return <p className="mt-4 text-[13px] text-white/50">Crowd data unavailable</p>;
  }

  return (
    <div className="mt-4">
      <div className="h-20 flex items-end justify-center gap-[5px]">
        {bars.map((height, index) => {
          const isPeak = index >= trueStartIdx && index <= trueEndIdx;
          return (
            <span
              key={index}
              className={`flex-1 rounded-t-sm transition-all duration-300 ${
                isPeak
                  ? 'bg-gradient-to-t from-amber-500 to-orange-300'
                  : 'bg-white/15'
              }`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] font-bold text-white/55">
        <span>{labels[0]}</span>
        <span>{labels[Math.floor(labels.length / 2)]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
}

// ─── Derive a safety label from the numeric part of a safetyScore string ──────
function getSafetyLabel(score) {
  if (!score) return 'Unknown';
  const num = parseFloat(score);
  if (isNaN(num)) return 'Unknown';
  if (num >= 9.5) return 'Very Safe';
  if (num >= 9.0) return 'Safe';
  if (num >= 8.0) return 'Mostly Safe';
  if (num >= 7.0) return 'Exercise Caution';
  return 'Use Caution';
}

// ─── Category-aware interesting-point icons ───────────────────────────────────
const CATEGORY_ICONS = {
  'Spiritual India':       ['temple_hindu', 'local_fire_department', 'music_note', 'photo_camera', 'star'],
  'Mountains & Himalayas': ['landscape', 'cloudy_snowing', 'hiking', 'photo_camera', 'explore'],
  'Royal Heritage':        ['account_balance', 'diamond', 'photo_camera', 'history_edu', 'star'],
  'Beaches & Islands':     ['beach_access', 'water', 'scuba_diving', 'photo_camera', 'sunny'],
  'Forest & Wildlife':     ['park', 'nature', 'photo_camera', 'water_drop', 'eco'],
  'Hidden Gems':           ['explore', 'photo_camera', 'landscape', 'star', 'history_edu'],
  'Food Trails':           ['restaurant', 'local_dining', 'emoji_food_beverage', 'photo_camera', 'star'],
  'Adventure Destinations':['hiking', 'sports_motorsports', 'explore', 'photo_camera', 'bolt'],
};
const DEFAULT_ICONS = ['explore', 'photo_camera', 'star', 'location_on', 'info'];

function DetailPanel({ icon, label, tone = 'text-primary', children }) {
  return (
    <div className="p-5 min-h-[190px] border-white/10 md:border-r last:border-r-0 flex flex-col">
      <div className="flex items-center gap-2.5 mb-1">
        <span className={`material-symbols-outlined text-[20px] ${tone}`}>{icon}</span>
        <p className="text-[11px] text-white/75 uppercase font-extrabold tracking-widest">{label}</p>
      </div>
      {children}
    </div>
  );
}

function DestinationDetailModal({ destination, isBookmarked, onBookmarkToggle, onClose }) {
  const details = useMemo(() => getDestinationDetails(destination), [destination]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Requesting location...');
  const [weather, setWeather] = useState({ status: 'loading' });

  // ── Lock body scroll while modal is open ──────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Close on Escape key ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // ── Geolocation ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('Location unavailable');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocationStatus('');
      },
      () => setLocationStatus('Location permission needed'),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, [details.id]);

  // ── Live weather from Open-Meteo ──────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    if (!details.coordinates) {
      setWeather({ status: 'unavailable' });
      return () => { mounted = false; };
    }
    setWeather({ status: 'loading' });
    const { lat, lon } = details.coordinates;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
    )
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        if (!mounted) return;
        const temp     = data?.current?.temperature_2m;
        const humidity = data?.current?.relative_humidity_2m;
        const wind     = data?.current?.wind_speed_10m;
        const code     = data?.current?.weather_code;
        // Normalise unit: "°C" or "°F"
        const rawUnit  = data?.current_units?.temperature_2m ?? '°C';
        const unit     = rawUnit.includes('F') ? '°F' : '°C';
        const condition = WEATHER_CODES[code] ?? 'Condition unavailable';
        setWeather(
          temp === undefined
            ? { status: 'unavailable' }
            : {
                status: 'ready',
                temp: `${Math.round(temp)}${unit}`,
                condition,
                humidity: humidity != null ? Math.round(humidity) : null,
                wind:     wind     != null ? Math.round(wind)     : null,
              }
        );
      })
      .catch(() => { if (mounted) setWeather({ status: 'unavailable' }); });
    return () => { mounted = false; };
  }, [details.coordinates, details.id]);

  // ── Derived display values ────────────────────────────────────────────────
  const distanceKm   = getDistanceKm(userLocation, details.coordinates);
  const city         = details.location?.split(',')[0]?.trim();
  const locationText = [city, details.country].filter(Boolean).join(', ') || details.location;
  const safetyLabel  = getSafetyLabel(details.safetyScore);
  const pointIcons   = CATEGORY_ICONS[details.category] ?? DEFAULT_ICONS;

  const weatherTemp      = weather.status === 'ready' ? weather.temp      : (weather.status === 'loading' ? '—' : 'N/A');
  const weatherCondition = weather.status === 'ready' ? weather.condition : (weather.status === 'loading' ? 'Loading…' : 'Data unavailable');

  // ── Crowd window label fallback ───────────────────────────────────────────
  const crowdLabel = details.crowdWindowLabel
    ?? (details.crowdLevel ? `${details.crowdLevel} traffic` : 'Peak period');

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md"
      style={{ animation: 'modalOverlayIn 0.28s ease forwards' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`${details.name} destination details`}
    >
      <div
        className="relative w-full sm:max-w-2xl lg:max-w-5xl max-h-[96dvh] sm:max-h-[92dvh] overflow-y-auto no-scrollbar bg-[#040812] sm:rounded-[30px] rounded-t-[30px] border border-slate-600/50 shadow-[0_30px_100px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.04)]"
        style={{ animation: 'modalSlideIn 0.38s cubic-bezier(0.16,1,0.3,1) forwards' }}
      >
        {/* ── Hero image header ──────────────────────────────────────── */}
        <div className="relative min-h-[280px] sm:min-h-[380px] overflow-hidden rounded-t-[30px]">
          <img
            src={details.image}
            alt={details.name}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[rgba(4,8,18,0.35)] to-[#040812]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(4,8,18,0.90)] via-transparent to-[rgba(4,8,18,0.55)]"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-black/30 backdrop-blur-sm text-white hover:bg-black/55 rounded-full flex items-center justify-center transition-all border border-white/20 hover:border-white/40 hover:scale-105"
            aria-label="Close destination details"
          >
            <span className="material-symbols-outlined text-[26px] sm:text-[30px]">close</span>
          </button>

          {/* Title block */}
          <div className="absolute left-5 right-16 bottom-8 sm:left-10 sm:right-20 sm:bottom-12">
            <span className="inline-flex text-[11px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full border border-amber-400/70 bg-black/40 text-[#ffc06e]">
              {details.category}
            </span>
            <h3 className="mt-3 text-[28px] sm:text-[44px] font-black text-white leading-tight tracking-tight">
              {details.name}
            </h3>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-white/85">
              <span className="flex items-center gap-1.5 text-[14px] sm:text-[16px] font-bold uppercase tracking-wide">
                <span className="material-symbols-outlined text-[20px] text-[#ffc06e]">location_on</span>
                {locationText}
              </span>
              <span className="hidden sm:block w-px h-5 bg-white/20" />
              <span className="flex items-center gap-1.5 text-[14px] sm:text-[15px] font-semibold">
                <span className="material-symbols-outlined text-[20px] text-cyan-300">near_me</span>
                {distanceKm
                  ? `${distanceKm.toLocaleString()} km from your location`
                  : locationStatus || 'Distance unavailable'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Info panels grid ───────────────────────────────────────── */}
        <div className="px-4 sm:px-8 pb-6 pt-0 space-y-6 text-left">
          <div className="-mt-7 relative z-10 grid grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-[22px] border border-slate-600/40 bg-[#080d1a]/95 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl divide-y-[1px] divide-white/8 lg:divide-y-0 lg:divide-x-[1px]">

            {/* Safety Index */}
            <DetailPanel icon="verified_user" label="Safety Index" tone="text-green-400">
              <div className="flex-1 flex flex-col items-center justify-center pt-3">
                <p className="text-[36px] sm:text-[40px] font-black leading-none text-green-400">
                  {details.safetyScore ?? 'N/A'}
                </p>
                <p className="mt-2 text-[14px] font-black text-green-400">{safetyLabel}</p>
              </div>
            </DetailPanel>

            {/* Diseases in Area */}
            <DetailPanel icon="healing" label="Diseases in Area" tone="text-rose-400">
              <div className="mt-2 flex-1">
                {details.healthRisk ? (
                  <>
                    <span className="inline-flex rounded-full bg-white/8 border border-white/12 px-3 py-1 text-[12px] font-bold text-white/80">
                      {details.healthRisk.level}
                    </span>
                    <p className="mt-3 text-[12px] font-semibold text-white/70">Area health risk</p>
                    <p className="mt-1 text-[15px] font-black leading-snug text-rose-300">
                      {details.healthRisk.name}
                    </p>
                    {details.healthRisk.cases && (
                      <p className="mt-3 text-[12px] font-semibold text-white/70">
                        Reported prevalence:{' '}
                        <span className="font-black text-rose-300">{details.healthRisk.cases}</span>
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-4 text-[13px] text-white/50">Data unavailable</p>
                )}
              </div>
            </DetailPanel>

            {/* Max Crowd Time */}
            <DetailPanel icon="groups" label="Peak Crowd Time" tone="text-amber-400">
              <div className="mt-2 flex-1 flex flex-col">
                {details.peakCrowdTime ? (
                  <>
                    <p className="text-[16px] sm:text-[18px] font-black leading-snug text-amber-400">
                      {details.peakCrowdTime}
                    </p>
                    <p className="mt-1 text-[12px] font-bold text-white/65">({crowdLabel})</p>
                    <div className="mt-auto">
                      <CrowdBars peakCrowdTime={details.peakCrowdTime} />
                    </div>
                  </>
                ) : (
                  <p className="mt-4 text-[13px] text-white/50">Data unavailable</p>
                )}
              </div>
            </DetailPanel>

            {/* Weather */}
            <DetailPanel icon="partly_cloudy_day" label="Weather" tone="text-cyan-300">
              <div className="mt-2 flex-1 flex flex-col">
                {weather.status === 'loading' ? (
                  <p className="mt-4 text-[13px] text-white/50 animate-pulse">Loading weather…</p>
                ) : weather.status === 'unavailable' ? (
                  <p className="mt-4 text-[13px] text-white/50">Data unavailable</p>
                ) : (
                  <>
                    <p className="text-[32px] sm:text-[36px] font-black leading-none text-cyan-300">
                      {weatherTemp}
                    </p>
                    <p className="mt-2 text-[14px] font-bold text-white">{weatherCondition}</p>
                    <div className="mt-4 space-y-1.5 text-[12px] text-white/70">
                      <p>
                        Humidity:{' '}
                        <span className="ml-2 font-bold text-white">
                          {weather.humidity != null ? `${weather.humidity}%` : '—'}
                        </span>
                      </p>
                      <p>
                        Wind:{' '}
                        <span className="ml-2 font-bold text-white">
                          {weather.wind != null ? `${weather.wind} km/h` : '—'}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        window.open(
                          `https://open-meteo.com/en/docs#latitude=${details.coordinates?.lat}&longitude=${details.coordinates?.lon}`,
                          '_blank'
                        )
                      }
                      className="mt-auto pt-3 inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/35 px-3 py-2 text-[12px] font-bold text-cyan-200 hover:bg-cyan-300/8 transition-colors"
                    >
                      View Forecast
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </>
                )}
              </div>
            </DetailPanel>
          </div>

          {/* ── Description ─────────────────────────────────────────── */}
          <div>
            <h4 className="text-[14px] sm:text-[15px] font-black uppercase text-[#ffc06e] tracking-widest mb-3">Description</h4>
            <p className="text-white/82 text-[16px] sm:text-[18px] leading-relaxed">
              {details.description || 'No description available for this destination.'}
            </p>
            <div className="mt-5 h-px w-24 bg-gradient-to-r from-amber-500/60 to-transparent"></div>
          </div>

          {/* ── Interesting Points ───────────────────────────────────── */}
          <div>
            <h4 className="text-[14px] sm:text-[15px] font-black uppercase text-[#ffc06e] tracking-widest mb-3">Interesting Points</h4>
            {details.interestingPoints?.length ? (
              <div className="divide-y divide-white/8">
                {details.interestingPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-4 py-3.5">
                    <span className="material-symbols-outlined text-[24px] text-amber-400 flex-shrink-0 mt-0.5">
                      {pointIcons[index % pointIcons.length]}
                    </span>
                    <p className="text-[15px] sm:text-[17px] text-white/82 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-white/50">No highlights available for this destination.</p>
            )}
          </div>

          {/* ── Action buttons ───────────────────────────────────────── */}
          <div className="flex gap-3 pt-2 pb-2">
            <button
              onClick={(e) => onBookmarkToggle(e, details.id)}
              className={`h-16 w-16 flex-shrink-0 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                isBookmarked
                  ? 'bg-primary-container/20 text-primary border-primary-container/40 shadow-[0_0_14px_rgba(255,153,51,0.25)]'
                  : 'bg-[#0b101b] text-white/70 border-slate-600/40 hover:bg-white/5 hover:text-white'
              }`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark destination'}
            >
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>
            <button
              onClick={() => { alert(`Routing generated for ${details.name}!`); onClose(); }}
              className="flex-1 h-16 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-[#321700] rounded-2xl text-[20px] sm:text-[24px] font-black hover:brightness-110 active:scale-[0.98] shadow-[0_12px_32px_rgba(255,153,51,0.30)] transition-all flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined text-[28px]">map</span>
              Plan Safe Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
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

      {/* Dynamic detail modal for selected Explore destination */}
      {selectedDest && (
        <DestinationDetailModal
          destination={selectedDest}
          isBookmarked={!!bookmarked[selectedDest.id]}
          onBookmarkToggle={handleBookmarkToggle}
          onClose={() => setSelectedDest(null)}
        />
      )}
    </section>
  );
}

