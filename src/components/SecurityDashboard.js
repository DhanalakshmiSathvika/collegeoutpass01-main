import React, { useEffect, useState, useRef } from "react";
import "./SecurityDashboard.css";

export function SecurityDashboard() {
  const [approvedList, setApprovedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const seenRef = useRef(new Set()); // track which approved IDs we've already notified

  // Poll interval (ms)
  const POLL_MS = 5000;
  const API = "http://localhost:5000/api/outpasses";

  useEffect(() => {
    let mounted = true;
    let timer = null;

    const fetchApproved = async () => {
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        // filter outpasses that HOD approved but not yet exited/returned/rejected by security
        const approved = (data.outpasses || []).filter(
          (o) => o.status === "approved"
        );
        if (!mounted) return;

        // notify about new ones we haven't seen
        approved.forEach((o) => {
          if (!seenRef.current.has(o.id)) {
            notifyGuard(o);
            seenRef.current.add(o.id);
          }
        });

        setApprovedList(approved);
      } catch (err) {
        console.error("Security fetch error", err);
      } finally {
        setLoading(false);
        timer = setTimeout(fetchApproved, POLL_MS);
      }
    };

    fetchApproved();

    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  // in-page + Notification API
  const notifyGuard = (outpass) => {
    const title = "New Approved Outpass";
    const body = `${outpass.studentEmail}\nReg: ${
      outpass.regNo || "-"
    }\nReason: ${outpass.reason}\nReturn: ${new Date(
      outpass.returnTime
    ).toLocaleString()}`;
    // Try browser Notification API
    if (window.Notification && Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (window.Notification && Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") new Notification(title, { body });
        else alert(`${title}\n\n${body}`);
      });
    } else {
      // fallback
      alert(`${title}\n\n${body}`);
    }
  };

  const handleAllowExit = async (id) => {
    try {
      const res = await fetch(`${API}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "exited", approver: "security" }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to update status");
      }
      // remove from list & mark seen
      setApprovedList((prev) => prev.filter((p) => p.id !== id));
      seenRef.current.delete(id);
    } catch (err) {
      console.error("Allow exit error", err);
      alert("Failed to allow exit. Try again.");
    }
  };

  const handleDenyExit = async (id) => {
    try {
      const res = await fetch(`${API}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "denied_by_security", approver: "security" }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to update status");
      }
      setApprovedList((prev) => prev.filter((p) => p.id !== id));
      seenRef.current.delete(id);
    } catch (err) {
      console.error("Deny exit error", err);
      alert("Failed to deny exit. Try again.");
    }
  };

  return (
    <div className="security-dashboard">
      <h2>Security - Approved Outpasses</h2>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : approvedList.length === 0 ? (
        <div className="empty-state">No approved outpasses waiting</div>
      ) : (
        <div className="requests-list">
          {approvedList.map((o) => (
            <div className="request-card" key={o.id}>
              <div className="request-header">
                <h3>{o.studentEmail}</h3>
                <div className="status-badge status-approved">approved</div>
              </div>
              <div className="request-body">
                <p>
                  <strong>Reg No:</strong> {o.regNo || "—"}
                </p>
                <p>
                  <strong>Parent:</strong> {o.parentPhone || "—"}
                </p>
                <p>
                  <strong>Reason:</strong> {o.reason}
                </p>
                <p>
                  <strong>Return:</strong>{" "}
                  {o.returnTime
                    ? new Date(o.returnTime).toLocaleString()
                    : "—"}
                </p>
                <p>
                  <strong>Requested on:</strong>{" "}
                  {o.createdAt
                    ? new Date(o.createdAt).toLocaleString()
                    : "—"}
                </p>
              </div>
              <div className="action-buttons">
                <button
                  className="btn-exit"
                  onClick={() => handleAllowExit(o.id)}
                >
                  Allow Exit
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleDenyExit(o.id)}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
