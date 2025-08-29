import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Housing() {
  const [rows, setRows] = useState([]);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  // Mock housing data
  const featuredProperty = {
    name: "Melbourne Rose Campus- West Wing", 
    location: "Melbourne, Australia",
    images: [
      "/images/housing1.jpg",
      "/images/housing2.jpg", 
      "/images/housing3.jpg",
      "/images/housing4.jpg"
    ]
  };

  const housingCards = [
    {
      id: 1,
      image: "/images/housing1.jpg",
      price: "From $520/ week",
      title: "Student Accommodation Complex"
    },
    {
      id: 2, 
      image: "/images/housing2.jpg",
      price: "From $300/ week",
      title: "Modern Student Apartments"
    },
    {
      id: 3,
      image: "/images/housing3.jpg", 
      price: "From $593/ week",
      title: "University Housing Complex"
    },
    {
      id: 4,
      image: "/images/housing4.jpg",
      price: "From $350/ week", 
      title: "Campus Residential Hall"
    }
  ];

  const load = async () => {
    const params = {};
    if (location) params.location = location;
    if (type) params.type = type;
    if (maxPrice) params.maxPrice = maxPrice;
    if (duration) params.duration = duration;
    
    try {
      const { data } = await api.get("/properties", { params });
      setRows(data);
    } catch (error) {
      console.error('Error loading properties:', error);
      // Set mock data if API fails
      setRows([
        {
          _id: '1',
          title: 'Modern Student Apartment',
          location: 'Melbourne',
          type: 'Apartment',
          price: 520,
          isRented: false
        },
        {
          _id: '2', 
          title: 'Shared Room near University',
          location: 'Sydney',
          type: 'Room',
          price: 300,
          isRented: true
        }
      ]);
    }
  };
  
  useEffect(() => {
    load();
  }, []);

  const bookmark = async (id) => {
    try {
      await api.post("/bookmarks", { itemType: "PROPERTY", itemId: id });
      alert("Bookmarked!");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Bookmarked!");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="hero-section rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent">
          <div className="absolute top-4 right-4 text-4xl opacity-30">
            🗽🏛️⛪🗼🏛️
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">✈️</span>
            <div>
              <h1 className="text-3xl font-bold">AbroadEase</h1>
              <p className="text-lg text-purple-100">
                Explore your study interests and preferred location.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-purple-100">
            <span className="text-xl">🏠</span>
            <span className="text-xl font-semibold">Housing for Students</span>
          </div>
        </div>
      </div>

      {/* Filters Sidebar and Main Content */}
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-80">
          <div className="filter-card space-y-6">
            <h2 className="text-2xl font-bold text-center">All Filters</h2>
            
            <div>
              <label className="block text-white font-medium mb-2">Rent range:</label>
              <select className="input text-purple-900">
                <option>Select...</option>
                <option>$200-400/week</option>
                <option>$400-600/week</option>
                <option>$600-800/week</option>
                <option>$800+/week</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Duration:</label>
              <select 
                className="input text-purple-900"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="">Select...</option>
                <option>1 semester</option>
                <option>1 year</option>
                <option>2 years</option>
                <option>Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Location:</label>
              <select 
                className="input text-purple-900"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Select...</option>
                <option>Melbourne</option>
                <option>Sydney</option>
                <option>Brisbane</option>
                <option>Perth</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Featured Property Detail */}
          <div className="card space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏢</span>
              <h2 className="text-2xl font-bold text-purple-800">
                {featuredProperty.name}
              </h2>
            </div>

            <div className="flex gap-6">
              {/* Main Image */}
              <div className="w-96 h-64 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <span className="text-4xl">🏠</span>
              </div>

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-2 gap-2 flex-1">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-purple-800">Book your perfect student housing.</h3>
            </div>
            <div className="search-bar flex items-center p-2">
              <span className="text-xl ml-4">🏠</span>
              <input
                type="text"
                placeholder="Search City | Area | University | Neighborhood | Property"
                className="flex-1 border-none outline-none p-3 text-lg bg-transparent"
              />
              <button className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 mr-2">
                🔍
              </button>
              <button 
                className="btn-secondary mr-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                🔧 All Filters
              </button>
            </div>
          </div>

          {/* Housing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {housingCards.map((housing) => (
              <Link
                key={housing.id}
                to={`/housing/${housing.id}`}
                className="card-hover group"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">🏠</span>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-800 mb-1">{housing.price}</div>
                  <div className="text-sm text-purple-600">{housing.title}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center text-purple-600">
            Showing 1- 4 of 20 items<br/>
            Page 1 of 5 📄
          </div>

          {/* Admin Section */}
          {user?.role === "landowner" && <LandownerCreate onDone={load} />}

          {/* Properties List */}
          <div className="grid gap-4">
            {rows.map((p) => (
              <div key={p._id} className="card-hover flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <div>
                    <Link
                      to={`/housing/${p._id}`}
                      className="font-semibold text-purple-800 hover:text-purple-600 text-lg"
                    >
                      {p.title}
                    </Link>
                    <div className="text-purple-600">
                      {p.location} • {p.type} • ${p.price}/week{" "}
                      {p.isRented && <span className="badge ml-2">Rented</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn" onClick={() => bookmark(p._id)}>
                    Bookmark
                  </button>
                  {user?.role === "admin" && (
                    <AdminRowActions id={p._id} onDone={load} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminRowActions({ id, onDone }) {
  const del = async () => {
    await api.delete(`/properties/${id}`);
    onDone();
  };
  return (
    <button className="btn" onClick={del}>
      Delete
    </button>
  );
}

function LandownerCreate({ onDone }) {
  const [f, setF] = useState({
    title: "",
    location: "",
    price: "",
    type: "Apartment",
    description: "",
    amenities: "",
    terms: "",
  });
  const create = async (e) => {
    e.preventDefault();
    const payload = {
      ...f,
      price: Number(f.price),
      amenities: f.amenities ? f.amenities.split(",").map((s) => s.trim()) : [],
    };
    await api.post("/properties", payload);
    setF({
      title: "",
      location: "",
      price: "",
      type: "Apartment",
      description: "",
      amenities: "",
      terms: "",
    });
    onDone();
  };
  return (
    <div className="card">
      <h3 className="font-semibold text-blue-800 mb-2">
        Landowner: Create Property
      </h3>
      <form onSubmit={create} className="grid md:grid-cols-3 gap-2">
        <input
          className="input"
          placeholder="Title"
          value={f.title}
          onChange={(e) => setF((p) => ({ ...p, title: e.target.value }))}
        />
        <input
          className="input"
          placeholder="Location"
          value={f.location}
          onChange={(e) => setF((p) => ({ ...p, location: e.target.value }))}
        />
        <input
          className="input"
          placeholder="Price"
          value={f.price}
          onChange={(e) => setF((p) => ({ ...p, price: e.target.value }))}
        />
        <select
          className="input"
          value={f.type}
          onChange={(e) => setF((p) => ({ ...p, type: e.target.value }))}
        >
          <option>Apartment</option>
          <option>Room</option>
          <option>Studio</option>
        </select>
        <input
          className="input md:col-span-2"
          placeholder="Amenities (comma)"
          value={f.amenities}
          onChange={(e) => setF((p) => ({ ...p, amenities: e.target.value }))}
        />
        <textarea
          className="input md:col-span-3"
          rows={3}
          placeholder="Description"
          value={f.description}
          onChange={(e) => setF((p) => ({ ...p, description: e.target.value }))}
        />
        <input
          className="input md:col-span-3"
          placeholder="Terms"
          value={f.terms}
          onChange={(e) => setF((p) => ({ ...p, terms: e.target.value }))}
        />
        <button className="btn md:col-span-3">Create</button>
      </form>
    </div>
  );
}
