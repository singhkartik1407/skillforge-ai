import Link from "next/link";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "AI Coding Practice",
    description:
      "Solve curated problems with real-time AI feedback on time complexity, space efficiency, and code style. Get personalized hints without spoilers.",
    color: "indigo",
    badge: "200+ Problems",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    title: "Aptitude Training",
    description:
      "Master quantitative reasoning, logical thinking, and verbal ability with adaptive MCQs. Detailed AI explanations help you understand concepts, not just answers.",
    color: "emerald",
    badge: "500+ Questions",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Communication Evaluation",
    description:
      "Write professional emails, answer interview questions, and practice business communication. AI scores your grammar, clarity, and tone with actionable feedback.",
    color: "amber",
    badge: "AI Powered",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Sign up and complete a quick skill assessment. Our AI maps your strengths and identifies areas for growth.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Practice & Learn",
    description: "Work through personalized challenges across coding, aptitude, and communication. Get instant AI feedback on every submission.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Track & Improve",
    description: "Monitor your progress with a comprehensive dashboard. AI recommends your next focus area based on performance patterns.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" x2="18" y1="20" y2="10" />
        <line x1="12" x2="12" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="14" />
      </svg>
    ),
  },
];

const stats = [
  { value: "10K+", label: "Active Learners" },
  { value: "700+", label: "Practice Problems" },
  { value: "94%", label: "Placement Rate" },
  { value: "4.9★", label: "User Rating" },
];

const colorBorderMap: Record<string, string> = {
  indigo: "border-indigo-500/30 hover:border-indigo-500/60",
  emerald: "border-emerald-500/30 hover:border-emerald-500/60",
  amber: "border-amber-500/30 hover:border-amber-500/60",
};
const colorIconBgMap: Record<string, string> = {
  indigo: "bg-indigo-500/15 text-indigo-400",
  emerald: "bg-emerald-500/15 text-emerald-400",
  amber: "bg-amber-500/15 text-amber-400",
};
const colorBadgeMap: Record<string, string> = {
  indigo: "bg-indigo-500/20 text-indigo-400",
  emerald: "bg-emerald-500/20 text-emerald-400",
  amber: "bg-amber-500/20 text-amber-400",
};
const colorGradientMap: Record<string, string> = {
  indigo: "from-indigo-500/10 to-violet-500/5",
  emerald: "from-emerald-500/10 to-teal-500/5",
  amber: "from-amber-500/10 to-orange-500/5",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-semibold text-white">SkillForge AI</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</a>
            <a href="#stats" className="text-sm text-gray-400 hover:text-white transition-colors">Results</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1.5">
              Sign In
            </Link>
            <Link
              href="/login"
              className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-violet-600/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[250px] h-[250px] bg-indigo-400/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            AI-Powered Skill Development · Now in Beta
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            AI-Based Holistic{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Skill Development
            </span>{" "}
            Platform
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Master coding, aptitude, and communication — all in one AI-powered platform. Get personalized
            feedback, track your progress, and land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              Get Started Free
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Live Demo
            </Link>
          </div>

          <p className="text-xs text-gray-600 mt-5">No credit card required · Free forever plan available</p>
        </div>

        {/* Hero Dashboard Preview */}
        <div className="max-w-4xl mx-auto mt-16 relative">
          <div className="bg-gray-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            <div className="border-b border-white/10 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-xs text-gray-600 ml-2">SkillForge AI — Dashboard</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Coding Score", value: "78", color: "indigo" },
                  { label: "Aptitude Score", value: "85", color: "emerald" },
                  { label: "Communication", value: "72", color: "amber" },
                ].map((card) => (
                  <div key={card.label} className="bg-gray-800/60 rounded-xl p-3 border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                    <p className="text-2xl font-bold text-white">{card.value}</p>
                    <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${card.color === "indigo" ? "bg-gradient-to-r from-indigo-500 to-violet-500" : card.color === "emerald" ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-amber-500 to-orange-500"}`}
                        style={{ width: `${card.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-800/40 rounded-xl p-3 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded bg-indigo-500/30 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-indigo-400">AI Recommendation</span>
                </div>
                <p className="text-xs text-gray-400">Focus on communication skills — your clarity scores can improve by 15% with targeted practice.</p>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent pointer-events-none rounded-2xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-14 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Everything You Need</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Three pillars of{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                career success
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Unlike other platforms that focus on one skill, SkillForge AI gives you the complete package.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`bg-gradient-to-br ${colorGradientMap[feature.color]} border ${colorBorderMap[feature.color]} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl ${colorIconBgMap[feature.color]} flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colorBadgeMap[feature.color]}`}>
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get started in minutes</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              No complex setup. Just sign up, practice, and watch your skills grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-indigo-500/50 to-indigo-500/50 via-indigo-500" />

            {steps.map((step, index) => (
              <div key={step.number} className="text-center relative">
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full text-xs font-bold text-white flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-3xl p-12 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-indigo-600/15 rounded-full blur-[60px] pointer-events-none" />
            <h2 className="text-4xl font-bold text-white mb-4 relative z-10">
              Ready to forge your skills?
            </h2>
            <p className="text-gray-400 mb-8 text-lg relative z-10">
              Join thousands of professionals who leveled up their careers with SkillForge AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                href="/login"
                className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30"
              >
                Start for Free
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-sm text-gray-400">SkillForge AI</span>
          </div>
          <p className="text-xs text-gray-600">© 2026 SkillForge AI. Built for Vibethon Hackathon.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">Privacy</span>
            <span className="text-xs text-gray-600">Terms</span>
            <span className="text-xs text-gray-600">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
