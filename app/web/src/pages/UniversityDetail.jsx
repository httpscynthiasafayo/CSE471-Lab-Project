import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/axios';

export default function UniversityDetail() {
  const { id } = useParams() // Get the university ID from the URL
  const [university, setUniversity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true)
        // This is the backend endpoint you need to create
        const { data } = await api.get(`/university/${id}`); 
        setUniversity(data)
      } catch (err) {
        console.error('Error fetching university details:', err)
        setError("Failed to load university details.")
        
        //Mock data
        setUniversity({
          _id: id,
          name: 'University of Sydney',
          location: 'Camperdown NSW 2006, Australia',
          country: 'Australia',
          programs: [
            {
              _id: 'prog1',
              name: 'Bachelor of Arts and Social Sciences',
              department: 'Faculty of Arts and Social Sciences',
              term: 'Fall 2024',
              degree: "Bachelor's degree",
              applicationFee: '100 AUD',
              tuitionFee: '40000 AUD',
              status: 'Start application'
            },
            {
              _id: 'prog2',
              name: 'Master of IT',
              department: 'Faculty of Engineering',
              term: 'Spring 2025',
              degree: "Master's degree",
              applicationFee: '100 AUD',
              tuitionFee: '45000 AUD',
              status: 'Start application'
            }
          ]
        })
        
      } finally {
        setLoading(false)
      }
    }
    fetchUniversity()
  }, [id]) // Re-run the effect when the ID changes

  if (loading) {
    return <div className="p-8 text-center text-purple-600">Loading university details...</div>
  }

  if (error && !university) {
    return <div className="p-8 text-center text-red-600">{error}. Please check your backend connection.</div>
  }
  
  const handleApply = () => {
    // You should replace this with a proper modal or navigation logic
    alert(`Applying to ${university.name}!`)
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Hero Section */}
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
      
      {/* University Detail section */}
      <div className="card space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏛️</span>
              <h2 className="text-2xl font-bold text-purple-800">
                {university.name} - {university.country}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-purple-600 mb-4">
              <span>📍</span>
              <span>{university.location}</span>
            </div>
            <button className="btn-primary" onClick={handleApply}>Apply Now</button>
          </div>
          <div className="w-64 h-48 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
            <span className="text-6xl">🇦🇺</span> {/* Updated flag emoji for Australia */}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-purple-800">
            Programs offered in {university.name}:
          </h3>
          
          {/* Programs Table */}
          <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-purple-50 border-b border-purple-200 font-semibold text-purple-800">
              <div className="flex items-center gap-2">Program Name</div>
              <div className="flex items-center gap-2">Department</div>
              <div className="flex items-center gap-2">Term</div>
              <div className="flex items-center gap-2">Degree Type</div>
            </div>
            
            {university.programs?.map((program) => (
              <div key={program._id} className="grid grid-cols-4 gap-4 p-4 border-b border-purple-100 hover:bg-purple-25">
                <div>
                  <div className="font-semibold text-purple-800">{program.name}</div>
                  <div className="text-sm text-purple-600">
                    Application Fee: {program.applicationFee}<br/>
                    Tuition Fee: {program.tuitionFee}<br/>
                    Duration: {program.duration} {program.degree}
                  </div>
                </div>
                <div className="text-purple-700">{program.department}</div>
                <div className="text-purple-700">{program.term}</div>
                <div>
                  <button className="btn text-sm">{program.status}</button>
                </div>
              </div>
            ))}
            
            <div className="p-4 text-center text-purple-600">
              {university.programs?.length || 0} items found
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}