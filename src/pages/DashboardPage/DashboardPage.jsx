// src/pages/DashboardPage/DashboardPage.jsx

import { useEffect } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import '../../styles/DashboardPage.css';

export default function DashboardPage() {
  useEffect(() => {
    document.title = buildTitle('Dashboard');
  }, []);

  return (
    <section
      className="dashboard page-container"
      aria-labelledby="dashboard-title"
    >
      <h1 id="dashboard-title" className="page-title">
        Dashboard
      </h1>

      <p className="dashboard-intro">
        Spotify overview will appear here.
      </p>
    </section>
  );
}
