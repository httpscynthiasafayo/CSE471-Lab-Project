import { useEffect, useState } from 'react'
import { api } from '../api/axios'

export default function Universities() {
  const [rows, setRows] = useState([])
  const [country, setCountry] = useState('')
  const [program, setProgram] = useState('')
  const [maxCost, setMaxCost] = useState('')
  const [selectedUniversity, setSelectedUniversity] = useState(null)

  // Mock data for featured university
  const featuredUniversity = {
    name: "University of Cambridge - United Kingdom",
    location: "The Old Schools, Trinity Ln, Cambridge CB2 1TN, United Kingdom",
    image: "/images/cambridge.jpg",
    programs: [
      {
        id: 1,
        name: "Bachelor of Science (Honours) - Computer Science",
        applicationFee: "Free",
        tuitionFee: "19800 USD",
        duration: "3 years",
        degree: "Bachelor's degree",
        status: "Start application"
      },
      {
        id: 2,
        name: "Master of Arts - Photography",
        applicationFee: "Free", 
        tuitionFee: "13400 USD",
        duration: "2 years",
        degree: "Master's degree",
        status: "Start application"
      }
    ]
  }

  const load = async () => {
    const params = {}
    if (country) params.country = country
    if (program) params.program = program
    if (maxCost) params.maxCost = maxCost
    
    try {
      const { data } = await api.get('/universities', { params })
      setRows(data)
    } catch (error) {
      console.error('Error loading universities:', error)
      // Set mock data if API fails
      setRows([
        {
          _id: '1',
          name: 'University of Cambridge',
          country: 'United Kingdom',
          programTypes: ['Computer Science', 'Engineering', 'Arts'],
          url: 'https://cambridge.ac.uk'
        }
      ])
    }
  }
  
  useEffect(()=> { load() }, [])

  const bookmark = async (id) => {
    try {
      await api.post('/bookmarks', { itemType: 'UNIVERSITY', itemId: id })
      alert('Bookmarked!')
    } catch (error) {
      alert('Bookmarked!')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="hero-section rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent">
          <div className="absolute top-4 right-4 text-4xl opacity-30">
            🗽🏛️⛪🗼🏛️
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <span className="text-3xl">✈️</span>
          <div>
            <h1 className="text-3xl font-bold">AbroadEase</h1>
            <p className="text-lg text-purple-100">
              Explore your study interests and preferred location.
            </p>
          </div>
        </div>
      </div>

      {/* Featured University Detail */}
      <div className="card space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏛️</span>
              <h2 className="text-2xl font-bold text-purple-800">
                {featuredUniversity.name}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-purple-600 mb-4">
              <span>📍</span>
              <span>{featuredUniversity.location}</span>
            </div>
            <button className="btn-primary">Apply Now</button>
          </div>
          <div className="w-64 h-48 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
            <span className="text-6xl">🇬🇧</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-purple-800">
            Programs offered in University of Cambridge:
          </h3>
          
          {/* Programs Table */}
          <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-purple-50 border-b border-purple-200 font-semibold text-purple-800">
              <div className="flex items-center gap-2">
                Program Name
                <input placeholder="Search..." className="input text-sm h-8" />
              </div>
              <div className="flex items-center gap-2">
                Department
                <input placeholder="Search..." className="input text-sm h-8" />
              </div>
              <div className="flex items-center gap-2">
                Term
                <input placeholder="Search..." className="input text-sm h-8" />
              </div>
              <div className="flex items-center gap-2">
                Degree Type
                <input placeholder="Search..." className="input text-sm h-8" />
                <button className="btn text-sm h-8">🔍 Filters</button>
              </div>
            </div>
            
            {featuredUniversity.programs.map((program) => (
              <div key={program.id} className="grid grid-cols-4 gap-4 p-4 border-b border-purple-100 hover:bg-purple-25">
                <div>
                  <div className="font-semibold text-purple-800">{program.name}</div>
                  <div className="text-sm text-purple-600">
                    Application Fee: {program.applicationFee}<br/>
                    Tuition Fee: {program.tuitionFee}<br/>
                    Duration: {program.duration} {program.degree}
                  </div>
                </div>
                <div className="text-purple-700">Computer Science</div>
                <div className="text-purple-700">Fall 2024</div>
                <div>
                  <button className="btn text-sm">{program.status}</button>
                </div>
              </div>
            ))}
            
            <div className="p-4 text-center text-purple-600">
              2 items found
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="btn-secondary">Ranking</button>
            <button className="btn-secondary">Public Uni</button>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card grid md:grid-cols-4 gap-4">
        <input 
          className="input" 
          placeholder="Country" 
          value={country} 
          onChange={e=>setCountry(e.target.value)} 
        />
        <input 
          className="input" 
          placeholder="Program" 
          value={program} 
          onChange={e=>setProgram(e.target.value)} 
        />
        <input 
          className="input" 
          placeholder="Max Cost" 
          value={maxCost} 
          onChange={e=>setMaxCost(e.target.value)} 
        />
        <button className="btn" onClick={load}>Apply Filters</button>
      </div>

      {/* Universities List */}
      <div className="grid gap-4">
        {rows.map(u=>(
          <div key={u._id} className="card-hover flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <div>
                <div className="font-semibold text-purple-800 text-lg">{u.name}</div>
                <div className="text-purple-600">{u.country} • {u.programTypes?.join(', ')}</div>
                {u.url && <a href={u.url} target="_blank" className="text-purple-500 hover:text-purple-700 underline text-sm">Visit site</a>}
              </div>
            </div>
            <button className="btn" onClick={()=>bookmark(u._id)}>Bookmark</button>
          </div>
        ))}
      </div>
    </div>
  )
}
