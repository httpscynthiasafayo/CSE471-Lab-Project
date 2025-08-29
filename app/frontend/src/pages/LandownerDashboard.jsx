import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';

// =========================================================================
// MOCK IMPLEMENTATIONS - REPLACE WITH YOUR ACTUAL CODE
// This is to make the component self-contained and fix the compilation error.
// =========================================================================

// Mock AuthContext and useAuth hook
const AuthContext = createContext(null);
const mockUser = {
  role: 'landowner',
  isLandownerVerified: true,
  name: 'Mock Landowner'
};

function useAuth() {
  const [user] = useState(mockUser);
  const logout = () => {
    console.log('Mock logout triggered.');
  };
  return { user, logout };
}

// Mock API service
const mockProperties = [
  { _id: 'prop1', title: 'Cozy Studio near Campus', location: '123 University Ave', price: 850, type: 'Studio', city: 'Cityville', area: '100 sq ft', roomNumber: 'Studio' },
  { _id: 'prop2', title: 'Spacious 2-Bedroom Apartment', location: '456 College Rd', price: 1500, type: 'Apartment', city: 'Townsburg', area: '900 sq ft', roomNumber: '2' },
];

const api = {
  get: async (url) => {
    console.log(`Mock GET request to ${url}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (url === '/properties/landowner/my-properties') {
      return { data: mockProperties };
    }
    return { data: [] };
  },
  delete: async (url) => {
    console.log(`Mock DELETE request to ${url}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { success: true } };
  },
};

// =========================================================================
// END OF MOCK IMPLEMENTATIONS
// =========================================================================

function LandownerDashboardPage() {
  const { user, logout } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const nav = useNavigate();

  // useEffect to check user status and fetch properties
  useEffect(() => {
    if (!user || user.role !== 'landowner') {
      nav('/landowner-login');
      return;
    }
    
    setVerificationStatus({
      isVerified: user.isLandownerVerified,
      status: user.isLandownerVerified ? 'approved' : 'pending'
    });

    if (user.isLandownerVerified) {
      fetchLandownerProperties();
    } else {
      setLoading(false);
    }
  }, [user, nav]);

  const fetchLandownerProperties = async () => {
    try {
      const { data } = await api.get('/properties/landowner/my-properties');
      setProperties(data);
    } catch (error) {
      console.error('Error fetching landowner properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    // This is a mock confirm, as the real window.confirm is not available in the sandbox.
    const isConfirmed = prompt("Are you sure you want to delete this property? Type 'yes' to confirm.") === 'yes';
    if (isConfirmed) {
      try {
        await api.delete(`/properties/${id}`);
        await fetchLandownerProperties();
      } catch (e) {
        console.error('Delete property error:', e);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      nav('/landowner-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Landowner Dashboard</h1>
        <button
          onClick={handleLogout}
          className="btn bg-red-600 hover:bg-red-700 text-white"
        >
          Logout
        </button>
      </div>

      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-2">Account Status</h3>
        <p className={`text-sm font-medium ${verificationStatus.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
          Verification Status: <span className="capitalize">{verificationStatus.status}</span>
        </p>
        {!verificationStatus.isVerified && (
          <div className="mt-2 text-sm text-gray-500">
            You can manage your properties only after your account is approved by an administrator.
          </div>
        )}
      </div>

      {verificationStatus.isVerified ? (
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">Your Property Listings</h3>
          {properties.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>You have not listed any properties yet.</p>
              <Link to="/housing" className="btn btn-primary mt-4">Add a Property Now</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((prop) => (
                <div key={prop._id} className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-lg text-blue-800">{prop.title}</h4>
                    <p className="text-sm text-gray-600">{prop.location} • ${prop.price} / month</p>
                    <p className="text-xs text-gray-500 mt-1">Type: {prop.type}</p>
                    <p className="text-xs text-gray-500 mt-1">City: {prop.city} | Area: {prop.area} | Rooms: {prop.roomNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteProperty(prop._id)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center py-8 text-gray-500">
            <p>Property management will be available after verification approval.</p>
        </div>
      )}
    </div>
  );
}

// Mock components for routing to prevent compilation errors
function MockLandownerLogin() {
  const navigate = useNavigate();
  return (
    <div className="text-center py-8">
      <h2 className="text-xl font-bold">Mock Landowner Login</h2>
      <p className="mt-2 text-gray-500">This is a placeholder for the login page.</p>
      <button onClick={() => navigate('/landowner-dashboard')} className="btn mt-4">Go to Dashboard</button>
    </div>
  );
}

function MockHousingPage() {
    const navigate = useNavigate();
    return (
        <div className="text-center py-8">
            <h2 className="text-xl font-bold">Mock Housing Page</h2>
            <p className="mt-2 text-gray-500">This is a placeholder for the housing page.</p>
            <button onClick={() => navigate('/landowner-dashboard')} className="btn mt-4">Go to Dashboard</button>
        </div>
    )
}


// Main App component to include the router
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landowner-dashboard" element={<LandownerDashboardPage />} />
        <Route path="/housing" element={<MockHousingPage />} />
        <Route path="/landowner-login" element={<MockLandownerLogin />} />
        <Route path="*" element={<MockLandownerLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

