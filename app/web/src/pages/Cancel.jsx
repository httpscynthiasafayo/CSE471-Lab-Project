import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cancel = () => {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#ffe6e6', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 8px #0001' }}>
        <div style={{ fontSize: '3rem', color: 'red' }}>✖</div>
        <h2>Payment Cancelled</h2>
        <p>No worries! You can try again whenever you're ready.<br />If you have any questions, feel free to contact our support team.</p>
        <button
          style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Try Again
        </button>
        <button
          style={{ marginTop: '1rem', marginLeft: '1rem', padding: '0.75rem 1.5rem', background: '#eee', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          onClick={() => window.location.href = 'mailto:support@yourdomain.com'}
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default Cancel;