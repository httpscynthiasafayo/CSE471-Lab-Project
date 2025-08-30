import { useEffect, useState, useRef } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
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
    if (searchQuery) params.search = searchQuery;
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
  }, [location, type, maxPrice, duration, searchQuery]); // Added dependencies to re-load on filter change

  const bookmark = async (id) => {
    try {
      await api.post("/bookmarks", { itemType: "PROPERTY", itemId: id });
      alert("Bookmarked!");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Bookmarked!");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    load();
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

      {/* Main Content and Filters Sidebar */}
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">

          {/* Search Bar */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-purple-800">Book your perfect student housing.</h3>
            </div>
            <form onSubmit={handleSearch} className="search-bar flex items-center p-2">
              <span className="text-xl ml-4">🏠</span>
              <input
                type="text"
                placeholder="Search City | Area | University | Neighborhood | Property"
                className="flex-1 border-none outline-none p-3 text-lg bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="btn-secondary mr-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                All Filters
              </button>
            </form>
          </div>

          {/* Filters Sidebar */}
          {showFilters && (
            <div className="filter-card space-y-6">
              <h2 className="text-2xl font-bold text-center">All Filters</h2>

              <div>
                <label className="block text-white font-medium mb-2">Rent range:</label>
                <select className="input text-purple-900" onChange={(e) => setMaxPrice(e.target.value)}>
                  <option value="">Select...</option>
                  <option value="400">$200-400/week</option>
                  <option value="600">$400-600/week</option>
                  <option value="800">$600-800/week</option>
                  <option value="99999">$800+/week</option>
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
                  <option>Adelaide</option>
                  <option>Canberra</option>
                  <option>Hobart</option>
                  <option>Darwin</option>
                  <option>Uttara</option>
                  <option>Gulshan</option>
                  <option>Dhanmondi</option>
                  <option>Banani</option>
                </select>
                 </div>
            </div>
          )}
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
           {/* jerin pt */}
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
          {/* jerin search br fin */}
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

          {/* Landowner Create Section: Only for verified landowners */}
          {user?.role === "landowner" && user?.isLandownerVerified && <LandownerCreate onDone={load} />}


          {/* Combined Properties List */}
          <div className="grid gap-4">
            {rows.length > 0 ? (
              rows.map((p) => (
                <div key={p._id} className="card-hover flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                      {p.photo ? <img
                      className="w-16 h-16 object-cover rounded-lg"
                      src={`data:${p.photoMime};base64,${p.photo}`}
                      alt="Property"
                    /> : <span className="text-2xl">🏠</span>}
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
              ))
            ) : (
              <div className="text-center text-gray-500">No properties found. Try adjusting your filters.</div>
            )}
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
    const [me, setMe] = useState(null) // ← signed-in user
    const [loadingMe, setLoadingMe] = useState(true)
  const [f, setF] = useState({
    title: "",
    location: "",
    price: "",
    type: "Apartment",
    description: "",
    amenities: "",
    terms: "",
    duration: "1 semester", // Add the new field with a default value
  });
// image state
  const [imgDataUrl, setImgDataUrl] = useState("") // data URL for preview
  const [imgMime, setImgMime] = useState("") // image MIME type (e.g., image/png)
  const fileInputRef = useRef(null)

  useEffect(() => {
    let mounted = true
      ; (async () => {
        try {
          const { data } = await api.get("/me")
          if (mounted) setMe(data)
        } catch {
          if (mounted) setMe(null) // Not logged in
        } finally {
          if (mounted) setLoadingMe(false)
        }
      })()
    return () => {
      mounted = false
    }
  }, [])

  const handleImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.")
      return
    }
    const MAX = 4 * 1024 * 1024 // 4MB
    if (file.size > MAX) {
      alert("Image is too large (max 4MB).")
      e.target.value = ""
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImgDataUrl(reader.result) // e.g., "data:image/png;base64,AAAA..."
      setImgMime(file.type)
    }
    reader.onerror = () => {
      alert("Could not read the selected file.")
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImgDataUrl("")
    setImgMime("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const clearForm = () => {
  
    setF({
      title: "",
      location: "",
      price: "",
      type: "Apartment",
      description: "",
      amenities: "",
      terms: "",
      duration: "1 semester",
    });
    removeImage();
  };

const create = async (e) => {
    e.preventDefault()

    const form = new FormData()
    form.append("ownerId", me?._id ?? "")
    form.append("title", f.title)
    form.append("location", f.location)
    form.append("price", String(Number(f.price)))
    form.append("type", f.type)
    form.append("description", f.description)
form.append("amenities", f.amenities);    form.append("terms", f.terms)

    if (imgDataUrl) {
      // turn dataURL into a real file part
      const blob = await (await fetch(imgDataUrl)).blob()
      const ext = (blob.type.split("/")[1] || "jpg").toLowerCase()
      form.append("photo", blob, `photo.${ext}`)
    }

    await api.post("/properties", form /* axios sets proper headers automatically */)
    clearForm()
    onDone()
  }

  // const create = async (e) => {
  //   e.preventDefault()

  //   const payload = {
  //     ownerId: me?._id,
  //     ...f,
  //     price: Number(f.price),
  //     amenities: f.amenities ? f.amenities.split(",").map((s) => s.trim()) : [],
  //   }

  //   if (imgDataUrl) {
  //     const base64 = imgDataUrl.split(",")[1] // strip "data:image/...;base64,"
  //     payload.photo = base64
  //     payload.photoMime = imgMime
  //   }

  //   await api.post("/properties", payload)
  //   clearForm()
  //   onDone()
  // }

    return (
    <div className="card" style={{ maxWidth: 500, margin: "0 auto" }}>
      <h3 className="font-semibold text-blue-800 mb-2 text-center">
        Landowner: Create Property
      </h3>
      <form onSubmit={create} className="grid grid-cols-3 gap-2">
        {/* First row: Title, Location, Price */}
        <input
          className="input col-span-1"
          placeholder="Title"
          value={f.title}
          onChange={(e) => setF((p) => ({ ...p, title: e.target.value }))}
        />
        <input
          className="input col-span-1"
          placeholder="Location"
          value={f.location}
          onChange={(e) => setF((p) => ({ ...p, location: e.target.value }))}
        />
        <input
          className="input col-span-1"
          placeholder="Price"
          value={f.price}
          onChange={(e) => setF((p) => ({ ...p, price: e.target.value }))}
        />
        {/* Second row: Apartment type, Amenities */}
        <select
          className="input col-span-1"
          value={f.type}
          onChange={(e) => setF((p) => ({ ...p, type: e.target.value }))}
        >
          <option>Apartment</option>
          <option>Room</option>
          <option>Studio</option>
        </select>
        <input
          className="input col-span-2"
          placeholder="Amenities (comma)"
          value={f.amenities}
          onChange={(e) => setF((p) => ({ ...p, amenities: e.target.value }))}
        />
        {/* Description (full width) */}
        <textarea
          className="input col-span-3"
          rows={3}
          placeholder="Description"
          value={f.description}
          onChange={(e) => setF((p) => ({ ...p, description: e.target.value }))}
        />
        {/* Terms (full width) */}
        <input
          className="input col-span-3"
          placeholder="Terms"
          value={f.terms}
          onChange={(e) => setF((p) => ({ ...p, terms: e.target.value }))}
        />
        {/* Create button (full width) */}
            {/* Image picker */}
        <div className="md:col-span-2 flex items-center gap-2">
          <label className="whitespace-nowrap">Photo</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="input w-full"
            onChange={handleImage}
            aria-label="Select Property Photo"
          />
          {imgDataUrl && (
            <div className="relative h-16 w-16">
              <img
                src={imgDataUrl}
                alt="Selected"
                className="h-16 w-16 object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-white/90 border rounded-full px-2 leading-none"
                title="Remove photo"
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <button className="btn col-span-3">Create</button>
      </form>
    </div>
  );
}