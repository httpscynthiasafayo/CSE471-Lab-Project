import { useState, useEffect } from 'react'
import { api } from '../api/axios'

export default function Visas() {
  const [visas, setVisas] = useState([])
  const [loading, setLoading] = useState(false)
  const [country, setCountry] = useState('')
  const [visaType, setVisaType] = useState('')
  const [selectedVisa, setSelectedVisa] = useState(null)
  const [error, setError] = useState('')

  const countries = ['Australia', 'UK', 'Canada']
  const visaTypes = ['Student', 'Tourist', 'Work', 'Permanent Resident']

  const loadVisas = async () => {
    setLoading(true)
    setError('')
    
    try {
      const params = {}
      if (country) params.country = country
      if (visaType) params.visaType = visaType
      
      const { data } = await api.get('/visas', { params })
      setVisas(data)
    } catch (error) {
      console.error('Error loading visas:', error)
      setError('Failed to load visa information. Please try again later.')
      // Mock data fallback
      setVisas([
        {
          _id: '1',
          country: 'Australia',
          visaType: 'Student',
          title: 'Student Visa (Subclass 500)',
          description: 'This visa allows you to stay in Australia to study full-time in a registered course.',
          processingTime: '4-6 weeks',
          fees: { amount: 650, currency: 'AUD', description: 'Base application charge' }
        },
        {
          _id: '2',
          country: 'UK',
          visaType: 'Student',
          title: 'Student Visa (Tier 4)',
          description: 'This visa allows you to study in the UK if you\'re 16 or over and want to study at a higher education level.',
          processingTime: '3 weeks',
          fees: { amount: 363, currency: 'GBP', description: 'Standard application fee' }
        },
        {
          _id: '3',
          country: 'Canada',
          visaType: 'Student',
          title: 'Study Permit',
          description: 'A study permit is a document issued by IRCC that allows foreign nationals to study at designated learning institutions (DLI) in Canada.',
          processingTime: '4-12 weeks',
          fees: { amount: 150, currency: 'CAD', description: 'Study permit fee' }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVisas()
  }, [country, visaType])

  const clearFilters = () => {
    setCountry('')
    setVisaType('')
  }

  const getCountryFlag = (country) => {
    const flags = {
      'Australia': '🇦🇺',
      'UK': '🇬🇧',
      'Canada': '🇨🇦'
    }
    return flags[country] || '🌍'
  }

  const getVisaTypeIcon = (type) => {
    const icons = {
      'Student': '🎓',
      'Tourist': '✈️',
      'Work': '💼',
      'Permanent Resident': '🏠'
    }
    return icons[type] || '📄'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-900 mb-4">
          📋 Visa Information
        </h1>
        <p className="text-lg text-purple-700 max-w-3xl mx-auto">
          Get comprehensive visa information and requirements for Australia, UK, and Canada. 
          Filter by country and visa type to find the information you need.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
        <h2 className="text-xl font-semibold text-purple-900 mb-4">Filter Visa Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Country Filter */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Countries</option>
              {countries.map(c => (
                <option key={c} value={c}>{getCountryFlag(c)} {c}</option>
              ))}
            </select>
          </div>

          {/* Visa Type Filter */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Visa Type
            </label>
            <select
              value={visaType}
              onChange={(e) => setVisaType(e.target.value)}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Visa Types</option>
              {visaTypes.map(type => (
                <option key={type} value={type}>{getVisaTypeIcon(type)} {type}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(country || visaType) && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-purple-600">Active filters:</span>
            {country && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {getCountryFlag(country)} {country}
              </span>
            )}
            {visaType && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {getVisaTypeIcon(visaType)} {visaType}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-purple-600">Loading visa information...</p>
        </div>
      )}

      {/* Results Count */}
      {!loading && (
        <div className="text-center">
          <p className="text-purple-600">
            Found {visas.length} visa{visas.length !== 1 ? 's' : ''} matching your criteria
          </p>
        </div>
      )}

      {/* Visa Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visas.map(visa => (
          <div
            key={visa._id}
            className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedVisa(visa)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCountryFlag(visa.country)}</span>
                <span className="font-semibold text-purple-900">{visa.country}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl">{getVisaTypeIcon(visa.visaType)}</span>
                <span className="text-sm text-purple-600">{visa.visaType}</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              {visa.title}
            </h3>

            <p className="text-purple-700 text-sm mb-4 line-clamp-3">
              {visa.description}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-600">Processing Time:</span>
                <span className="text-sm font-medium text-purple-900">{visa.processingTime}</span>
              </div>
              
              {visa.fees && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-600">Fee:</span>
                  <span className="text-sm font-medium text-purple-900">
                    {visa.fees.amount} {visa.fees.currency}
                  </span>
                </div>
              )}
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* No Results */}
      {!loading && visas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-purple-900 mb-2">No visa information found</h3>
          <p className="text-purple-600 mb-4">
            Try adjusting your filters or clearing them to see all available visa information.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Visa Detail Modal */}
      {selectedVisa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getCountryFlag(selectedVisa.country)}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-purple-900">{selectedVisa.title}</h2>
                    <p className="text-purple-600">{selectedVisa.country} - {selectedVisa.visaType} Visa</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVisa(null)}
                  className="text-purple-400 hover:text-purple-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Description</h3>
                  <p className="text-purple-700">{selectedVisa.description}</p>
                </div>

                {/* Key Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Processing Time</h4>
                    <p className="text-purple-700">{selectedVisa.processingTime}</p>
                  </div>
                  
                  {selectedVisa.fees && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Application Fee</h4>
                      <p className="text-purple-700">
                        {selectedVisa.fees.amount} {selectedVisa.fees.currency}
                        {selectedVisa.fees.description && (
                          <span className="block text-sm text-purple-600 mt-1">
                            {selectedVisa.fees.description}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Requirements */}
                {selectedVisa.requirements && selectedVisa.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {selectedVisa.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-600 mt-1">•</span>
                          <span className="text-purple-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructions */}
                {selectedVisa.instructions && selectedVisa.instructions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Application Steps</h3>
                    <ol className="space-y-3">
                      {selectedVisa.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                            {instruction.step}
                          </span>
                          <span className="text-purple-700">{instruction.description}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Documents */}
                {selectedVisa.documents && selectedVisa.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Required Documents</h3>
                    <div className="space-y-2">
                      {selectedVisa.documents.map((doc, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                          <span className={`text-sm px-2 py-1 rounded ${doc.required ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {doc.required ? 'Required' : 'Optional'}
                          </span>
                          <div>
                            <p className="font-medium text-purple-900">{doc.name}</p>
                            {doc.description && (
                              <p className="text-sm text-purple-600 mt-1">{doc.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                {selectedVisa.additionalInfo && (
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">Additional Information</h3>
                    <p className="text-purple-700 bg-blue-50 p-4 rounded-lg">{selectedVisa.additionalInfo}</p>
                  </div>
                )}

                {/* Application Link */}
                {selectedVisa.applicationUrl && (
                  <div className="text-center pt-4 border-t border-purple-200">
                    <a
                      href={selectedVisa.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Apply Now
                      <span>↗</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}