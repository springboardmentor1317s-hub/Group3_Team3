import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/95 backdrop-blur-xl p-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            CampusEventHub
          </div>

          
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative flex min-h-[70vh] items-center justify-center">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.pexels.com/photos/1047451/pexels-photo-1047451.jpeg')",
            }}
          />
          
          {/* Purple gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-800/95 via-purple-700/90 to-indigo-600/85" />

          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
            <h1 className="mb-6 text-4xl font-black md:text-6xl">
              Welcome To Our Event 
              <span className="block bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                Planning World
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-indigo-100">
              Plan, host, and discover inter-college events with ease.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <button className="rounded-2xl bg-white px-10 py-4 text-lg font-bold text-indigo-700 shadow-2xl hover:shadow-3xl hover:-translate-y-1">
                  Create Account
                </button>
              </Link>
              <Link to="/login">
                <button className="rounded-2xl border-2 border-white/70 px-10 py-4 text-lg font-semibold text-white hover:bg-white/20">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20">
          <h2 className="mb-16 text-center text-4xl font-black text-slate-900">
            Why CampusEventHub?
            </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              title="Central Event Hub"
              text="Browse all inter-college events in one place with powerful search and filters by category, date, and college."
              icon="📍"
              color="from-emerald-500 to-emerald-600"
            />
            <FeatureCard
              title="Organizer Dashboards"
              text="College admins create events, manage registrations, and monitor live stats in a clean, intuitive dashboard."
              icon="⚡"
              color="from-blue-500 to-blue-600"
            />
            <FeatureCard
              title="Smart Registrations"
              text="Instant approvals, waitlist support, real-time status updates, and seamless slot management for students."
              icon="🎫"
              color="from-purple-500 to-purple-600"
            />
            <FeatureCard
              title="Feedback & Insights"
              text="Collect ratings, comments, and analytics to measure engagement and continuously improve campus events."
              icon="⭐"
              color="from-amber-500 to-amber-600"
            />
          </div>
        </section>
         
      </main>
    </div>
  );
}

function FeatureCard({ title, text, icon, color }) {
  return (
    <div className="group relative rounded-3xl bg-white/80 p-10 shadow-2xl backdrop-blur-xl hover:bg-white hover:shadow-3xl hover:-translate-y-4 transition-all duration-500 border border-white/50 overflow-hidden">
      {/* Gradient accent */}
      <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-3xl bg-gradient-to-br ${color} opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500`}/>
      
      <div className="mb-6 text-4xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      
      <h3 className="mb-4 text-2xl font-bold text-slate-900 group-hover:text-primary-700 transition-all duration-300">
        {title}
      </h3>
      
      <p className="text-base text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}

export default HomePage;
