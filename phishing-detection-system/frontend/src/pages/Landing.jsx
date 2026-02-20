import { Link } from 'react-router-dom';
import CyberBackground from '../components/CyberBackground';
import QuantumSimulation from '../components/QuantumSimulation';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <CyberBackground variant="particles" />
      <QuantumSimulation fixed={true} />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-cyan-500/5 to-cyan-500/10 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5 md:py-6 border-b border-cyan-500/20 backdrop-blur-sm bg-slate-900/30 min-h-[72px]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-cyber-lg animate-glow-pulse">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-display text-xl md:text-2xl font-bold tracking-wider text-slate-200">
            QUANTUM <span className="text-cyan-400">SHIELD</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <Link to="/admin/login" className="btn-ghost text-slate-500 hover:text-violet-400 hover:border-violet-500/50">
            Admin Login
          </Link>
          <Link to="/login" className="btn-ghost">
            Login
          </Link>
          <Link to="/register" className="cyber-btn text-white">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center px-6 text-center py-24">
        <div className="stagger-children max-w-5xl">
          <p className="text-cyan-400 font-mono text-sm tracking-[0.3em] uppercase mb-4">
            Quantum + ML Security
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Real-Time
            </span>
            <br />
            <span className="text-slate-200">Phishing Detection</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Hybrid Quantum + Machine Learning model to detect phishing websites in real time.
            Enter a URL and get instant risk assessment with confidence scores.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="cyber-btn text-white font-display tracking-wide flex items-center gap-2">
              Get Started
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="relative z-10 page-section px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4 text-slate-200">
            THE <span className="text-cyan-400">PROBLEM</span>
          </h2>
          <p className="text-slate-500 text-center max-w-3xl mx-auto mb-12 text-lg leading-relaxed">
            Phishing attacks cost organizations billions and put user credentials and data at risk.
            Traditional rule-based filters struggle with evolving tactics. We need smarter, faster detection.
          </p>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {[
              { title: 'Evolving threats', desc: 'Attackers constantly change domains and patterns' },
              { title: 'Scale', desc: 'Millions of URLs to evaluate in real time' },
              { title: 'Accuracy', desc: 'Balance between blocking threats and avoiding false positives' },
            ].map((item) => (
              <div key={item.title} className="cyber-panel p-6 text-center hover:border-cyan-500/40 transition-colors">
                <h3 className="font-display text-cyan-400 font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 page-section px-6 md:px-10 bg-slate-900/30 border-y border-cyan-500/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4 text-slate-200">
            HOW IT <span className="text-cyan-400">WORKS</span>
          </h2>
          <p className="text-slate-500 text-center max-w-2xl mx-auto mb-16 text-lg">
            From URL input to verdict in seconds using a hybrid quantum–ML pipeline.
          </p>
          <div className="grid md:grid-cols-4 gap-6 stagger-children">
            {[
              { step: '01', title: 'URL input', desc: 'User enters a link to check' },
              { step: '02', title: 'Feature extraction', desc: 'URL and domain features are computed' },
              { step: '03', title: 'Quantum + ML', desc: 'Scaler, quantum features, then final classifier' },
              { step: '04', title: 'Verdict', desc: 'Phishing or Legitimate with confidence %' },
            ].map((item) => (
              <div key={item.step} className="cyber-panel p-6 relative overflow-hidden group">
                <span className="absolute top-4 right-4 font-mono text-2xl text-cyan-500/30 group-hover:text-cyan-500/50">{item.step}</span>
                <h3 className="font-display text-cyan-400 font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="relative z-10 page-section px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4 text-slate-200">
            TECH <span className="text-cyan-400">STACK</span>
          </h2>
          <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 text-lg">
            Full-stack security platform with quantum-inspired ML.
          </p>
          <div className="flex flex-wrap justify-center gap-4 stagger-children">
            {['React', 'Node.js', 'Express', 'MongoDB', 'Python', 'FastAPI', 'Scikit-learn', 'XGBoost', 'Qiskit', 'TailwindCSS'].map((tech) => (
              <span
                key={tech}
                className="px-5 py-2.5 rounded-xl border border-cyan-500/30 text-cyan-300/90 font-mono text-sm hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all duration-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 page-section px-6 md:px-10 bg-slate-900/30 border-y border-cyan-500/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4 text-slate-200">
            FEATURES
          </h2>
          <p className="text-slate-500 text-center max-w-2xl mx-auto mb-16 text-lg">
            Everything you need for secure, real-time phishing analysis.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {[
              { title: 'Quantum ML', desc: 'Hybrid quantum feature extraction for advanced threat signals', icon: '⚛' },
              { title: 'Real-Time scan', desc: 'Instant URL analysis with confidence scores', icon: '⚡' },
              { title: 'Secure auth', desc: 'JWT, bcrypt, role-based access (User & Admin)', icon: '🔒' },
              { title: 'History & analytics', desc: 'Per-user history and admin-wide analytics', icon: '📊' },
              { title: 'Admin dashboard', desc: 'Manage users, view predictions, analytics charts', icon: '🛡️' },
              { title: 'API gateway', desc: 'Node backend + FastAPI ML service', icon: '🔌' },
            ].map((f) => (
              <div
                key={f.title}
                className="cyber-panel p-6 text-left group hover:scale-[1.02] transition-transform duration-300"
              >
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 className="font-display text-cyan-400 font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About project */}
      <section className="relative z-10 page-section px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-slate-200">
            ABOUT THIS <span className="text-cyan-400">PROJECT</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-6">
            Quantum Shield is a full-stack web application that combines classical machine learning with
            quantum-inspired feature processing to detect phishing URLs in real time. Users can register,
            log in, and submit URLs for instant classification. Admins get a dedicated dashboard with
            user management, prediction analytics, and system-wide metrics. The backend uses Node.js and
            Express for auth and API gateway, with a separate Python FastAPI service running the ML pipeline
            (scaler, optional quantum model, and final classifier). Models can be trained offline and
            deployed as pickle files for fast inference.
          </p>
          <p className="text-slate-500 text-sm">
            Built with React, TailwindCSS, MongoDB, and a focus on scalability and security.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 page-section px-6 md:px-10 border-t border-cyan-500/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-slate-200">
            Ready to protect your links?
          </h2>
          <p className="text-slate-500 mb-8">Register free and start scanning URLs in seconds.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="cyber-btn text-white font-display">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
            <Link to="/admin/login" className="btn-ghost text-violet-400 hover:border-violet-500/50">
              Admin Login
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
