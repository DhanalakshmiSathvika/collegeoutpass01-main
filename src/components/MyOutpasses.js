import React, { useEffect, useState } from 'react';
import './MyOutpasses.css';

export function MyOutpasses() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    // Load initial outpasses
    const fetchOutpasses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/outpasses');
        const data = await response.json();
        // Filter outpasses for current user
        const userOutpasses = data.outpasses.filter(op => op.studentEmail === email);
        setList(userOutpasses);
      } catch (error) {
        console.error('Error fetching outpasses:', error);
      } finally {
        setLoading(false);
      }
    };

    // Listen for new outpass events
    const handleNewOutpass = (event) => {
      const newOutpass = event.detail;
      if (newOutpass.studentEmail === email) {
        setList(prevList => [newOutpass, ...prevList]);
      }
    };

    // Add event listener and fetch initial data
    window.addEventListener('outpassCreated', handleNewOutpass);
    fetchOutpasses();

    // Cleanup listener
    return () => window.removeEventListener('outpassCreated', handleNewOutpass);
  }, [email]);

  if (!email) {
    return <div className="empty-state">Please login to view your outpasses</div>;
  }

  if (loading) {
    return <div className="loading-state">Loading outpasses...</div>;
  }

  return (
    <div className="my-outpasses">
      <h2>My Outpasses</h2>
      {list.length === 0 ? (
        <div className="empty-state">No outpasses found</div>
      ) : (
        <div className="outpass-list">
          {list.map(outpass => (
            <div key={outpass.id} className="outpass-card">
              <div className="outpass-header">
                <h3>{outpass.reason}</h3>
                <span className={`status-badge status-${outpass.status}`}>
                  {outpass.status}
                </span>
              </div>
              <div className="outpass-details">
                <p><strong>Applied on:</strong> {new Date(outpass.createdAt).toLocaleString()}</p>
                <p><strong>Parent Phone:</strong> {outpass.parentPhone}</p>
                {outpass.returnTime && (
                  <p><strong>Return Time:</strong> {new Date(outpass.returnTime).toLocaleString()}</p>
                )}
                {outpass.approver && (
                  <p><strong>Approved by:</strong> {outpass.approver}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
