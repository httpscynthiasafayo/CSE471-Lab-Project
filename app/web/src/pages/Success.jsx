import React from 'react';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const { user, setUser, refresh } = useAuth();
  const navigate = useNavigate();
  // useEffect(() => {
  //   const markPremium = async () => {
  //     try {
  //       const res = await fetch('http://localhost:1617/api/me/subscribe-premium', {
  //         method: 'POST',
  //         credentials: 'include',
  //       });
  //       const data = await res.json();
  //       setUser({ ...user, subscription: data.subscription });
  //       navigate('/'); 
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   markPremium();
  // }, []);
  useEffect(() => {
  const markPremium = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    if (!sessionId) return;

    // Get Stripe session details from api
    const res = await fetch(`http://localhost:1617/api/stripe/get-session-details?sessionId=${sessionId}`);
    const { subscriptionId } = await res.json();

    // Call subscribe-premium with subscriptionId
    await fetch('http://localhost:1617/api/me/subscribe-premium', {
      method: 'POST',
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId })
    });
    // ...existing code...
    await refresh(); // This will update user info in context
    navigate('/');   // Go to Home page
    };
    markPremium();
  }, []);
    
  //return <h1>Payment Successful! Redirecting...</h1>;

  return (
    <div style={{ background: '#e6fff2', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 8px #0001' }}>
        <div style={{ fontSize: '3rem', color: 'green' }}>✔</div>
        <h2>Payment Successful!</h2>
        <p>Thank you for your subscription. You now have access to all the amazing features!</p>
        <button
          style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          &larr; Back to Main
        </button>
      </div>
    </div>
  );
};

export default Success;





