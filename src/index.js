import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// College Outpass System Entry Point
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Performance and diagnostics logging
// To measure app performance, pass a function to log results (ex: logPerformance)
// or connect to monitoring tools like ReportWebVitals.
const logPerformance = (metric) => {
  console.log(`[Performance] ${metric.name}: ${metric.value.toFixed(2)}ms`);
};

export function reportWebVitals(callback = logPerformance) {
  if (callback && callback instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(callback);
      getFID(callback);
      getFCP(callback);
      getLCP(callback);
      getTTFB(callback);
    });
  }
}

// Start performance logging
reportWebVitals();
