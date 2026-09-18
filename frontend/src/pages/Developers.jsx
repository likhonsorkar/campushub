import { Link } from 'react-router-dom';
import GraduationCap from '../components/GraduationCap';

const developers = [
  {
    name: 'Md. Likhon Sorkar',
    role: 'Backend Developer',
    image: '/developers/likhon-sorkar.jpg',
    alt: 'Md. Likhon Sorkar',
    bio: 'Built the Django REST API, authentication flow, resource management, and backend architecture for CampusHub.',
    links: [
      { label: 'Website', href: 'https://likhon.com.bd/' },
      { label: 'GitHub', href: 'https://github.com/likhonsorkar' },
      { label: 'LinkedIn', href: 'https://bd.linkedin.com/in/likhonsorkar' },
      { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100067771030297' },
    ],
  },
  {
    name: 'Md. Ashraful Ahsan',
    role: 'Frontend Developer',
    image: '/developers/ashraful-ahsan.jpeg',
    alt: 'Md. Ashraful Ahsan',
    bio: 'Designed and built the React interface, responsive experience, resource discovery workflow, and visual system for CampusHub.',
    links: [
      { label: 'Website', href: 'https://ahsantech.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/Ashraful-Ahsan' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/md-ashraful-ahsan-902975200/' },
      { label: 'Facebook', href: 'https://www.facebook.com/ahsanpx/' },
      { label: 'Instagram', href: 'https://www.instagram.com/ahsanxt/' },
    ],
  },
];

function ExternalLink({ label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-lg border border-[#24B1B1]/35 bg-[#054c4c]/70 px-3 py-2 text-xs font-semibold text-[#FFE2AF] transition hover:-translate-y-0.5 hover:border-[#FFE2AF]/70 hover:bg-[#0e6b6b]"
    >
      {label}
    </a>
  );
}

export default function Developers() {
  return (
    <div className="min-h-screen app-bg text-slate-100">
      <header className="sticky top-0 z-50 border-b border-[#24B1B1]/45 bg-[#065f5f]/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#24B1B1]/50 bg-[#007979] shadow-lg shadow-[#24B1B1]/20 transition-all duration-300 group-hover:scale-105">
              <span className="transition-transform duration-300 group-hover:rotate-6"><GraduationCap /></span>
            </div>
            <div className="text-2xl font-black uppercase tracking-wide text-[#FFE2AF] transition-colors group-hover:text-[#fff7e6]">
              CAMPUSHUB
            </div>
          </Link>

          <Link to="/" className="secondary-button px-4 py-2 text-sm">
            Back to home
          </Link>
        </div>
      </header>

      <main className="animated-bg relative overflow-hidden">
        <div className="orb one" />
        <div className="orb two" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="topic-pill mx-auto mb-5">Final-year thesis project</div>
            <h1 className="hero-title text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Meet the developers
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              A final-year thesis project shaped by thoughtful backend engineering and a focused frontend experience.
            </p>
          </div>

          <section className="mt-14 grid gap-6 lg:grid-cols-2" aria-label="CampusHub developers">
            {developers.map((developer) => (
              <article key={developer.name} className="resource-card rounded-3xl p-5 sm:p-7">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <img
                    src={developer.image}
                    alt={developer.alt}
                    className="h-32 w-32 shrink-0 rounded-2xl border-2 border-[#FFE2AF]/35 object-cover shadow-xl shadow-[#003f3f]/40"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8dd3d1]">{developer.role}</p>
                    <h2 className="mt-2 text-2xl font-black text-[#FFE2AF]">{developer.name}</h2>
                    <p className="mt-4 text-sm leading-7 text-[#f0d7a4]">{developer.bio}</p>
                  </div>
                </div>
                <div className="mt-7 flex flex-wrap gap-2 border-t border-[#FFE2AF]/15 pt-5">
                  {developer.links.map((link) => (
                    <ExternalLink key={link.label} {...link} />
                  ))}
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
