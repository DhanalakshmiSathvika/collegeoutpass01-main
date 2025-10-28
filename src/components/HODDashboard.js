import React, { useEffect, useState } from 'react';
import './HODDashboard.css';

export function HODDashboard() {
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!email) return;
    load();
    // eslint-disable-next-line
  }, [email]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/outpasses');
      const data = await res.json();
      setOutpasses(data.outpasses || []);
    } catch (err) {
      console.error('Error fetching outpasses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/outpasses/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action, approver: email })
      });
      if (!res.ok) throw new Error('Failed to update');
      await load();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="hod-dashboard"><h2>Loading...</h2></div>;

  return (
    <div className="hod-dashboard">
      <h2>Outpass Requests</h2>
      <div className="requests-list">
        {outpasses.length === 0 ? (
          <div className="empty-state">No outpass requests found</div>
        ) : (
          outpasses.map((outpass) => (
            <div key={outpass.id} className="request-card">
              <div className="request-header">
                <h3>Student: {outpass.studentEmail}</h3>
                <span className={`status-badge status-${outpass.status}`}>
                  {outpass.status}
                </span>
              </div>
              <div className="request-body">
                <p><strong>Parent's Phone:</strong> {outpass.parentPhone}</p>
                <p><strong>Reason:</strong> {outpass.reason}</p>
                <p><strong>Requested on:</strong> {outpass.createdAt ? new Date(outpass.createdAt).toLocaleString() : '—'}</p>
              </div>

              {outpass.status === 'pending' && (
                <div className="action-buttons">
                  <button className="btn-approve" onClick={() => handleAction(outpass.id, 'approved')}>Approve</button>
                  <button className="btn-reject" onClick={() => handleAction(outpass.id, 'rejected')}>Reject</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
