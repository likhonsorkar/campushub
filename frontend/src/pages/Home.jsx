import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getResources, getDepartments, getSubjects } from '../services/resourceService';
import GraduationCap from '../components/GraduationCap';

export default function Home() {
  const [resources, setResources] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resData, deptData, subjData] = await Promise.all([
          getResources(),
          getDepartments(),
          getSubjects(),
        ]);
        setResources(resData.data);
        setDepartments(deptData.data);
        setSubjects(subjData.data);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredResources = resources.filter((item) => {
    const title = item.title ? item.title.toLowerCase() : '';
    const description = item.description ? item.description.toLowerCase() : '';
    const subjectCode = item.subject_code ? item.subject_code.toLowerCase() : '';

    const matchesSearch =
      title.includes(searchQuery.toLowerCase()) ||
      description.includes(searchQuery.toLowerCase()) ||
      subjectCode.includes(searchQuery.toLowerCase());

    const matchesType = selectedType ? item.resource_type === selectedType : true;
    const matchingSubject = subjects.find((s) => s.id === item.subject);
    const matchesDept = selectedDept
      ? matchingSubject?.department === Number(selectedDept)
      : true;
    const matchesSemester = selectedSemester
      ? matchingSubject?.semester === Number(selectedSemester)
      : true;

    return matchesSearch && matchesType && matchesDept && matchesSemester;
  }).sort((first, second) => {
    if (sortOrder === 'downloads') {
      return (second.download_count || 0) - (first.download_count || 0);
    }
    if (sortOrder === 'title') {
      return (first.title || '').localeCompare(second.title || '');
    }
    return second.id - first.id;
  });

  const totalPages = Math.max(1, Math.ceil(filteredResources.length / pageSize));
  const paginatedResources = filteredResources.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stats = {
    resources: resources.length,
    departments: departments.length,
    downloads: resources.reduce((acc, curr) => acc + (curr.download_count || 0), 0),
  };

  return (
    <div className="min-h-screen app-bg text-slate-100">
      <header className="sticky top-0 z-50 border-b border-[#24B1B1]/45 bg-[#065f5f]/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#24B1B1]/50 bg-[#007979] shadow-lg shadow-[#24B1B1]/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#065f5f] group-hover:shadow-[#24B1B1]/40">
              <span className="transition-transform duration-300 group-hover:rotate-6"><GraduationCap /></span>
            </div>
            <div>
              <div className="text-2xl font-black uppercase tracking-wide text-[#FFE2AF] transition-colors group-hover:text-[#fff7e6]">CAMPUSHUB</div>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="secondary-button text-sm px-4 py-2">
              Log in
            </Link>
            <Link to="/register" className="primary-button text-sm px-4 py-2">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="animated-bg relative">
        <div className="orb one" />
        <div className="orb two" />
        <div className="orb three" />

        <div className="relative max-w-6xl mx-auto px-4 py-18 md:py-24 text-center">
          <div className="topic-pill mx-auto mb-6">Final Year Thesis Project</div>
          <h1 className="hero-title text-4xl md:text-7xl font-black tracking-tight leading-tight mb-6">
            Build Your Academic Future
            <span className="block text-white/90">
              With CampusHub
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-base md:text-xl text-slate-300 leading-relaxed mb-8">
            Discover lecture notes, old question papers, books, and course materials in one modern digital library designed for university students.
          </p>

          <div className="marquee-box mx-auto mb-10 max-w-4xl text-slate-200">
            <div className="marquee-track">
              <span>Lecture Notes</span>
              <span>•</span>
              <span>Question Papers</span>
              <span>•</span>
              <span>Reference Books</span>
              <span>•</span>
              <span>Semester Materials</span>
              <span>•</span>
              <span>CampusHub</span>
              <span>•</span>
              <span>Lecture Notes</span>
              <span>•</span>
              <span>Question Papers</span>
              <span>•</span>
              <span>Reference Books</span>
              <span>•</span>
              <span>Semester Materials</span>
              <span>•</span>
              <span>CampusHub</span>
            </div>
          </div>

          <div className="mx-auto max-w-2xl rounded-3xl border border-[#24B1B1]/40 bg-[#065f5f] p-2 shadow-xl shadow-[#003f3f]/30 backdrop-blur-lg">
            <div className="flex items-center gap-3 rounded-2xl bg-[#054c4c] px-4 py-3">
              <span className="text-2xl text-[#FFE2AF]">⌕</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search by title, keyword, or subject code..."
                className="w-full bg-transparent text-[#FFE2AF] placeholder:text-[#a9d8d4] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                  className="rounded-lg border border-[#24B1B1] bg-[#0e6b6b] px-3 py-1.5 text-xs font-medium text-[#FFE2AF] transition hover:bg-[#24B1B1]/20 hover:text-[#fff7e6]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="metric-card p-6">
              <div className="text-3xl font-black text-[#FFE2AF]">{stats.resources}+</div>
              <div className="mt-2 text-sm uppercase tracking-[0.22em] text-[#f1d7a2]">Resources</div>
            </div>
            <div className="metric-card p-6">
              <div className="text-3xl font-black text-[#FFE2AF]">{stats.departments}</div>
              <div className="mt-2 text-sm uppercase tracking-[0.22em] text-[#f1d7a2]">Departments</div>
            </div>
            <div className="metric-card p-6">
              <div className="text-3xl font-black text-[#FFE2AF]">{stats.downloads}</div>
              <div className="mt-2 text-sm uppercase tracking-[0.22em] text-[#f1d7a2]">Downloads</div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-panel mb-10 rounded-3xl p-4 sm:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#FFE2AF]">Filter</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">

              <select
                value={selectedDept}
                onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
                className="select-field max-w-[210px] border-[#24B1B1]"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.code} - {dept.name}
                  </option>
                ))}
              </select>

              <select
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
                aria-label="Sort resources"
                className="select-field max-w-[190px] border-[#24B1B1]"
              >
                <option value="newest">Newest First</option>
                <option value="downloads">Most Downloaded</option>
                <option value="title">Title A-Z</option>
              </select>

              <select
                value={selectedSemester}
                onChange={(e) => { setSelectedSemester(e.target.value); setCurrentPage(1); }}
                className="select-field max-w-[180px] border-[#24B1B1]"
              >
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
                className="select-field max-w-[190px] border-[#24B1B1]"
              >
                <option value="">All Types</option>
                <option value="NOTE">Lecture Notes</option>
                <option value="QUESTION">Question Papers</option>
                <option value="BOOK">Books / PDFs</option>
              </select>
            </div>

            {(selectedDept || selectedSemester || selectedType || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedDept('');
                  setSelectedSemester('');
                  setSelectedType('');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="secondary-button px-4 py-2 text-sm"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-300">Loading resources...</div>
        ) : filteredResources.length === 0 ? (
          <div className="soft-panel rounded-3xl border border-dashed border-slate-600 p-12 text-center">
            <p className="text-xl font-semibold text-slate-200">No matching resources found.</p>
            <p className="mt-2 text-sm text-slate-400">Try changing your search or reset the filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedResources.map((item) => (
              <article key={item.id} className="resource-card rounded-3xl p-6 text-[#fef2d0]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
                      item.resource_type === 'NOTE'
                        ? 'bg-[#0d5959] text-[#ffe2af] border border-[#6ecdc7]'
                        : item.resource_type === 'QUESTION'
                          ? 'bg-[#1b6c6c] text-[#fff0cf] border border-[#8dd3d1]'
                          : 'bg-[#0f4d4d] text-[#ffe2af] border border-[#7ec7c9]'
                    }`}
                  >
                    {item.resource_type === 'NOTE' && 'Lecture Note'}
                    {item.resource_type === 'QUESTION' && 'Question'}
                    {item.resource_type === 'BOOK' && 'Book'}
                  </span>
                  <span className="rounded-full border border-[#7dc6c6] bg-[#0c4c4c] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f7dfae]">
                    {item.subject_code || 'N/A'}
                  </span>
                </div>

                <h3 className="mb-3 text-2xl font-bold text-[#fff0cf]">{item.title}</h3>
                <p className="mb-5 text-sm leading-7 text-[#f0d7a4]">
                  {item.description || 'No description provided for this academic resource.'}
                </p>

                <div className="flex items-center justify-between border-t border-[#7db6b5] pt-4 text-sm text-[#f3d8a1]">
                  <span>By @{item.uploaded_by_username || 'anonymous'}</span>
                  {item.file ? (
                    <a
                      href={item.file}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#ffe2af] transition hover:text-[#fff7e6]"
                    >
                      Download ↓
                    </a>
                  ) : (
                    <span>No File</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && filteredResources.length > 0 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#24B1B1]/30 pt-5 sm:flex-row">
            <p className="text-sm text-[#f0d7a4]">
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredResources.length)} of {filteredResources.length} resources
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="secondary-button px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="min-w-24 text-center text-sm font-semibold text-[#FFE2AF]">Page {currentPage} of {totalPages}</span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="secondary-button px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-[#73d9d7] bg-[#065f5f] py-10">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mb-3 text-xl font-black tracking-[0.18em] text-[#ffe2af] uppercase">CampusHub</div>
          <p className="text-sm text-[#f4dfb0]">
            Developed by <a href="https://likhon.com.bd/" target="_blank" rel="noreferrer" className="font-semibold text-[#fff0cf] transition hover:text-[#24B1B1]">Md. Likhon Sorkar</a> & <a href="https://ahsantech.vercel.app/" target="_blank" rel="noreferrer" className="font-semibold text-[#fdeab9] transition hover:text-[#24B1B1]">Md. Ashraful Ahsan</a>
          </p>
          <Link to="/developers" className="secondary-button mt-5 px-4 py-2 text-sm">
            Meet the developers
          </Link>
          <p className="mt-5 text-xs text-[#f0dba6]">© 2026 CampusHub • Final Year Thesis Project</p>
        </div>
      </footer>

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          title="Back to top"
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[#FFE2AF]/45 bg-[#0e6b6b] text-2xl font-bold leading-none text-[#FFE2AF] shadow-xl shadow-[#003f3f]/40 transition hover:-translate-y-1 hover:bg-[#24B1B1] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FFE2AF] focus:ring-offset-2 focus:ring-offset-[#007979]"
        >
          ↑
        </button>
      )}
    </div>
  );
}