import { Link } from 'react-router-dom';

const features = [
  { title: 'STEM Lab Establishment', description: 'Deploy robotics, IoT, and AI labs in partner schools for next-generation learning.' },
  { title: 'Advanced Technology Training', description: 'Deliver practical instruction in 3D printing, space tech, AR/VR, coding, and drone systems.' },
  { title: 'Real-World Innovation Projects', description: 'Guide students to build smart delivery drones, QR code door locks, and invention prototypes.' },
  { title: 'School Partnership Workflows', description: 'Connect principals and sales reps through dashboards for onboarding and performance tracking.' }
];

const services = [
  { title: 'STEM Labs in Schools', description: 'State-of-the-art robotics, IoT, and artificial intelligence labs built for school innovation.' },
  { title: 'Advanced Technology Training', description: 'Hands-on classes in 3D printing, space tech, AR/VR, coding, and drone technologies.' },
  { title: 'Real-World Student Projects', description: 'Students create practical inventions with mentorship from Qwings experts.' }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
      <header className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-3xl font-semibold tracking-tight">Qwings</div>
            <div className="mt-2 text-slate-300">School Partnership Management System</div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/20 hover:bg-brand-aqua">
              Admin Login
            </Link>
            <Link to="/login" className="rounded-full border border-slate-200/20 bg-white/10 px-5 py-3 text-sm text-slate-100 hover:bg-white/10">
              Sales Login
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-16 sm:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-block rounded-full bg-brand-blue/20 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">Modern School SaaS</p>
            <h1 className="text-5xl font-semibold tracking-tight">Empower schools with STEM labs, real innovation projects, and smart partnership workflows.</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">Qwings enables principals and sales reps to manage school partnerships while delivering robotics, IoT, AI, and drone-based learning experiences.</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/login" className="inline-flex items-center justify-center rounded-full bg-brand-aqua px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-brand-aqua/20 hover:bg-cyan-400">
                Start demo
              </Link>
              <Link to="#services" className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm text-white hover:border-brand-blue/50">
                Explore services
              </Link>
            </div>
          </div>
          <div className="grid gap-6 rounded-[2rem] bg-slate-900/80 p-10 shadow-2xl shadow-slate-900/40 ring-1 ring-white/10">
            <div className="overflow-hidden rounded-[1.75rem] bg-slate-950">
              <img src="/download.jfif" alt="Qwings STEM labs" className="h-full w-full object-cover" />
            </div>
            <div className="rounded-3xl bg-slate-950 p-8">
              <h2 className="text-3xl font-semibold">Qwings technology services</h2>
              <p className="mt-4 text-slate-400">We help schools set up innovation labs, train students in advanced tech, and support real-world project development.</p>
            </div>
          </div>
        </section>

        <section className="mt-24" id="services">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-brand-aqua">Services</p>
              <h2 className="text-4xl font-semibold text-white">Built for long-term school partnerships.</h2>
            </div>
            <p className="max-w-xl text-slate-300">From onboarding to reporting, Qwings connects principals and sales teams through simple workflows and analytics.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="rounded-[2rem] border border-white/10 bg-slate-900 p-8 shadow-xl shadow-slate-950/30">
                <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-3 text-slate-400">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 grid gap-10 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white/5 p-10 shadow-2xl shadow-slate-950/20 ring-1 ring-white/10">
            <h2 className="text-3xl font-semibold text-white">Designed for modern school leaders</h2>
            <p className="mt-4 text-slate-300">The admin dashboard helps principals manage school profiles, validate CSV uploads, and keep data organized for better decision-making.</p>
            <div className="mt-8 space-y-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-brand-blue/10 p-10">
            <h2 className="text-3xl font-semibold text-white">Trusted by school teams</h2>
            <div className="mt-8 space-y-4">
              <div className="rounded-3xl bg-slate-950/70 p-6">
                <p className="text-slate-300">“Qwings gave our principal team a single place to review student records and manage partner schools effectively.”</p>
                <div className="mt-4 text-sm text-brand-aqua">Principal Amina</div>
              </div>
              <div className="rounded-3xl bg-slate-950/70 p-6">
                <p className="text-slate-300">“Sales lead tracking is easier than ever with stage-based progression and analytics.”</p>
                <div className="mt-4 text-sm text-brand-aqua">Samuel K., Sales Representative</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 rounded-[2rem] bg-slate-950/90 p-10 text-white ring-1 ring-white/10 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-brand-aqua">Contact</p>
            <h2 className="mt-4 text-3xl font-semibold">Ready to manage partnerships with clarity?</h2>
            <p className="mt-3 text-slate-300">Contact our support team at info@qwings.co or begin your login journey now.</p>
          </div>
          <div className="mt-6 sm:mt-0">
            <Link to="/login" className="inline-flex rounded-full bg-brand-aqua px-8 py-4 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
              Login to Qwings
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
