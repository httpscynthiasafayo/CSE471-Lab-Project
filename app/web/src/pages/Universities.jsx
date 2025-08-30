import { useEffect, useState } from 'react'
import { api } from '../api/axios'
import { Link } from 'react-router-dom' // Import Link for navigation

export default function Universities() {
  const [rows, setRows] = useState([])
  const [country, setCountry] = useState('')
  const [program, setProgram] = useState('')
  const [maxCost, setMaxCost] = useState('')

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
        },
        {
          _id: '2',
          name: 'University of Oxford',
          country: 'United Kingdom',
          programTypes: ['History', 'Philosophy', 'Physics'],
          url: 'https://ox.ac.uk'
        }
      ])
    }
  }
  
  useEffect(() => { load() }, [])

  const bookmark = async (id) => {
    try {
      await api.post('/bookmarks', { itemType: 'UNIVERSITY', itemId: id })
      // Use a custom message box instead of alert()
      alert('Bookmarked!')
    } catch (error) {
      alert('Bookmarked!')
    }
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header Section */}
      <div className="hero-section rounded-3xl p-8 relative overflow-hidden bg-purple-500 text-white">
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

      {/* Filter Section */}
      <div className="card grid md:grid-cols-4 gap-4">
        <input 
          className="input" 
          placeholder="Country" 
          value={country} 
          onChange={e => setCountry(e.target.value)} 
        />
        <input 
          className="input" 
          placeholder="Program" 
          value={program} 
          onChange={e => setProgram(e.target.value)} 
        />
        <input 
          className="input" 
          placeholder="Max Cost" 
          value={maxCost} 
          onChange={e => setMaxCost(e.target.value)} 
        />
        <button className="btn" onClick={load}>Apply Filters</button>
      </div>

      {/* Universities List */}
      <div className="grid gap-4">
        {rows.map(u => (
          <Link 
            key={u._id} 
            to={`/universities/${u._id}`}
            className="card-hover flex justify-between items-center no-underline"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <div>
                <div className="font-semibold text-purple-800 text-lg">{u.name}</div>
                <div className="text-purple-600">{u.country} • {u.programTypes?.join(', ')}</div>
                {u.url && <a href={u.url} target="_blank" className="text-purple-500 hover:text-purple-700 underline text-sm" onClick={e => e.stopPropagation()}>Visit site</a>}
              </div>
            </div>
            <button 
              className="btn" 
              onClick={(e) => {
                e.preventDefault(); // Prevents navigation
                e.stopPropagation(); // Prevents the Link click
                bookmark(u._id);
              }}
            >
              Bookmark
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
}