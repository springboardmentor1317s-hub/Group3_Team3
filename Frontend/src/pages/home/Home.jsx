import { Link } from "react-router";

function HomePage() {
  return (
    <div className="home-root">
      {/* Navbar */}
      <header className="home-navbar">
        <div className="home-logo">CampusEventHub</div>

        <nav className="home-nav-links">
          <a href="#features" className="home-nav-link">
            Features
          </a>
          <a href="#how-it-works" className="home-nav-link">
            How it works
          </a>
        </nav>

        <div className="home-nav-actions">
          <Link to="/login">
            <button className="btn-outline">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn-primary">Create Account</button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="home-main">
        <section className="home-hero">
          <div className="home-hero-left">
            <div className="home-hero-badges">
              <span className="home-badge">Inter-College Events</span>
              <span className="home-badge">Sports · Hackathons · Cultural</span>
            </div>

            <h1>Manage every campus event in one place.</h1>
            <p>
              CampusEventHub connects colleges and students to discover,
              register, and manage inter-college events with real-time updates
              and feedback.
            </p>

            <div className="home-hero-cta">
              <Link to="/login">
                <button className="btn-primary">Get Started</button>
              </Link>
              <Link to="/register">
                <button className="btn-outline">Create Account</button>
              </Link>
              <span className="home-hero-note">
                No setup cost · Works across colleges
              </span>
            </div>
          </div>

          <aside className="home-hero-right">
            <div className="home-stat-pill">
              Live overview
              <span>Campus stats</span>
            </div>

            <h3 style={{ margin: 0, fontSize: "1rem" }}>
              Today&apos;s Activity
            </h3>
            <p style={{ marginTop: "0.25rem", fontSize: "0.8rem", color: "#9ca3af" }}>
              Demo snapshot of how CampusEventHub dashboards feel.
            </p>

            <div className="home-stat-grid">
              <div className="home-stat-card">
                <div className="home-stat-label">Active Events</div>
                <div className="home-stat-value">12</div>
                <div style={{ fontSize: "0.7rem", color: "#16a34a" }}>
                  +8% vs last week
                </div>
              </div>
              <div className="home-stat-card">
                <div className="home-stat-label">Registrations</div>
                <div className="home-stat-value">1,234</div>
                <div style={{ fontSize: "0.7rem", color: "#a5b4fc" }}>
                  Across 5 colleges
                </div>
              </div>
              <div className="home-stat-card">
                <div className="home-stat-label">Avg Rating</div>
                <div className="home-stat-value">4.6</div>
                <div style={{ fontSize: "0.7rem", color: "#f97316" }}>
                  Event feedback
                </div>
              </div>
              <div className="home-stat-card">
                <div className="home-stat-label">Pending Approvals</div>
                <div className="home-stat-value">27</div>
                <div style={{ fontSize: "0.7rem", color: "#f97373" }}>
                  For organizers
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>

      {/* Features strip */}
      <section id="features" className="home-features">
        <div className="home-feature-grid">
          <div className="home-feature-card">
            <div className="home-feature-title">Central event listings</div>
            <div className="home-feature-text">
              Students browse all inter-college events in one place with rich
              filters and search.
            </div>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-title">Organizer dashboards</div>
            <div className="home-feature-text">
              College admins create events, manage registrations, and track
              performance.
            </div>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-title">Smart registrations</div>
            <div className="home-feature-text">
              Slot management with approvals, waitlists, and real-time status
              updates.
            </div>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-title">Feedback & insights</div>
            <div className="home-feature-text">
              Ratings and comments help improve future events and measure
              engagement.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
