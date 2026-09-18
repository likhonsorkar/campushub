import { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getResources, deleteResource, createResource, getDepartments, getSubjects } from '../services/resourceService';
import { getUserProfile, logoutUser } from '../services/authService';
import GraduationCap from '../components/GraduationCap';
import Toast from '../components/Toast';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resource_type: 'NOTE',
    subject: '',
    file: null,
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const pageSize = 6;

  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      const [profileRes, resourcesRes] = await Promise.all([
        getUserProfile(),
        getResources(),
      ]);
      setProfile(profileRes.data);
      setResources(resourcesRes.data);
    } catch (err) {
      console.error('Failed to load user dashboard:', err);
      logoutUser();
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchDashboardData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchDashboardData]);

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    try {
      const [deptRes, subjRes] = await Promise.all([
        getDepartments(),
        getSubjects(),
      ]);
      setDepartments(deptRes.data);
      setSubjects(subjRes.data);
    } catch (err) {
      console.error('Failed to fetch modal metadata:', err);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setProfile(null);
    navigate('/', { replace: true });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(id);
        setResources((currentResources) => currentResources.filter((res) => res.id !== id));
        setToast({ message: 'Resource deleted successfully.', type: 'success' });
      } catch {
        setToast({ message: 'Failed to delete resource.', type: 'error' });
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject) {
      setUploadError('Please select a subject.');
      return;
    }
    if (!formData.file) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setUploadLoading(true);
    setUploadError('');

    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('resource_type', formData.resource_type);
    uploadData.append('subject', formData.subject);
    uploadData.append('file', formData.file);

    try {
      await createResource(uploadData);
      setIsModalOpen(false);
      setToast({ message: 'Resource uploaded successfully.', type: 'success' });
      setFormData({ title: '', description: '', resource_type: 'NOTE', subject: '', file: null });
      setCurrentPage(1);
      fetchDashboardData();
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to upload resource.';
      setUploadError(message);
      setToast({ message, type: 'error' });
    } finally {
      setUploadLoading(false);
    }
  };

  const filteredSubjects = selectedDept
    ? subjects.filter((s) => s.department === Number(selectedDept))
    : subjects;

  const totalDownloads = resources.reduce((sum, item) => sum + (item.download_count || 0), 0);
  const myUploads = resources.filter((item) => item.uploaded_by_username === profile?.username).length;
  const sortedResources = [...resources].sort((first, second) => {
    if (sortOrder === 'downloads') return (second.download_count || 0) - (first.download_count || 0);
    if (sortOrder === 'title') return (first.title || '').localeCompare(second.title || '');
    return second.id - first.id;
  });
  const totalPages = Math.max(1, Math.ceil(sortedResources.length / pageSize));
  const paginatedResources = sortedResources.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center app-bg text-lg font-medium text-[#FFE2AF]">
        Loading User Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen app-bg text-slate-100">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <nav className="sticky top-0 z-40 border-b border-[#24B1B1]/45 bg-[#065f5f]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="group flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#24B1B1]/50 bg-[#007979] shadow-lg shadow-[#24B1B1]/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#065f5f] group-hover:shadow-[#24B1B1]/40">
                <span className="transition-transform duration-300 group-hover:rotate-6"><GraduationCap /></span>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8dd3d1] transition-colors group-hover:text-[#FFE2AF]">CampusHub</div>
                <div className="text-lg font-extrabold text-[#FFE2AF] transition-colors group-hover:text-[#fff7e6]">Dashboard</div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden rounded-full border border-[#24B1B1]/55 bg-[#0e6b6b] px-3 py-2 text-sm font-medium text-[#FFE2AF] sm:inline-block">
              👤 {profile?.username}
            </span>
            <button onClick={handleLogout} className="secondary-button px-4 py-2 text-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="topic-pill mb-3">User Workspace</div>
            <h1 className="text-3xl font-black text-[#FFE2AF] md:text-4xl">Academic Resources Center</h1>
          </div>
          <button onClick={handleOpenModal} className="primary-button">
            + Upload New Resource
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="metric-card p-5">
            <div className="text-sm uppercase tracking-[0.18em] text-[#f1d7a2]">Total Resources</div>
            <div className="mt-3 text-3xl font-black text-[#FFE2AF]">{resources.length}</div>
          </div>
          <div className="metric-card p-5">
            <div className="text-sm uppercase tracking-[0.18em] text-[#f1d7a2]">Your Uploads</div>
            <div className="mt-3 text-3xl font-black text-[#FFE2AF]">{myUploads}</div>
          </div>
          <div className="metric-card p-5">
            <div className="text-sm uppercase tracking-[0.18em] text-[#f1d7a2]">Downloads</div>
            <div className="mt-3 text-3xl font-black text-[#FFE2AF]">{totalDownloads}</div>
          </div>
        </div>

        {resources.length === 0 ? (
          <div className="soft-panel rounded-3xl border border-dashed border-[#24B1B1] p-12 text-center">
            <p className="text-xl font-semibold text-[#FFE2AF]">No resources uploaded yet.</p>
            <p className="mt-2 text-sm text-[#f0d7a4]">Click “Upload New Resource” to add your first course material.</p>
          </div>
        ) : (
          <>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-[#f0d7a4]">Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedResources.length)} of {sortedResources.length} resources</p>
            <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }} aria-label="Sort dashboard resources" className="select-field max-w-[210px] border-[#24B1B1]">
              <option value="newest">Newest First</option>
              <option value="downloads">Most Downloaded</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedResources.map((item) => (
              <article key={item.id} className="resource-card rounded-3xl p-6 text-[#fef2d0]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-[#0d5959] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFE2AF] border border-[#6ecdc7]">
                    {item.resource_type}
                  </span>
                  <span className="text-[10px] tracking-[0.18em] text-[#f1d7a2] uppercase">{item.subject_code}</span>
                </div>

                <h3 className="mb-3 text-2xl font-bold text-[#fff0cf]">{item.title}</h3>
                <p className="mb-5 text-sm leading-7 text-[#f0d7a4]">{item.description || 'No description provided.'}</p>

                <div className="flex items-center justify-between border-t border-[#7db6b5] pt-4 text-sm text-[#f3d8a1]">
                  <span>Downloads: {item.download_count}</span>
                  {item.file && (
                    <a href={item.file} target="_blank" rel="noreferrer" className="font-semibold text-[#FFE2AF] transition hover:text-[#fff7e6]">
                      Open File ↓
                    </a>
                  )}
                </div>

                {profile?.username === item.uploaded_by_username && (
                  <div className="mt-4 border-t border-[#7db6b5] pt-4 text-right">
                    <button onClick={() => handleDelete(item.id)} className="text-sm font-semibold text-[#f0b86b] transition hover:text-[#FFE2AF]">
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center justify-end gap-4 border-t border-[#24B1B1]/30 pt-5 sm:flex-row">
            <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="secondary-button px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            <span className="text-sm font-semibold text-[#FFE2AF]">Page {currentPage} of {totalPages}</span>
            <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="secondary-button px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40">Next</button>
          </div>
          </>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#003f3f]/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-[#24B1B1]/55 bg-[#065f5f] p-6 shadow-2xl shadow-[#002f2f]/40">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="topic-pill">Upload Resource</div>
                <h3 className="mt-3 text-2xl font-black text-[#FFE2AF]">Add Academic Material</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close upload modal"
                className="rounded-lg p-2 text-3xl font-bold text-[#FFE2AF] transition hover:bg-[#24B1B1]/20 hover:text-[#E37434]"
              >
                ×
              </button>
            </div>

            {uploadError && (
              <div className="mb-4 rounded-xl border border-red-500/35 bg-red-500/10 p-3 text-sm text-red-200">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#FFE2AF]">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures Midterm Notes"
                  className="input-field"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#FFE2AF]">Department</label>
                  <select
                    className="select-field"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                  >
                    <option value="">Select Dept</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.code}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#FFE2AF]">Subject</label>
                  <select
                    required
                    className="select-field"
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="">Select Subject</option>
                    {filteredSubjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#FFE2AF]">Type</label>
                  <select
                    className="select-field"
                    value={formData.resource_type}
                    onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
                  >
                    <option value="NOTE">Lecture Note</option>
                    <option value="QUESTION">Question Paper</option>
                    <option value="BOOK">Book / PDF</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#FFE2AF]">File</label>
                  <input
                    type="file"
                    required
                    className="w-full rounded-xl border border-[#24B1B1] bg-[#054c4c] p-3 text-sm text-[#FFE2AF] file:mr-3 file:rounded-lg file:border-0 file:bg-[#24B1B1]/20 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#FFE2AF]"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#FFE2AF]">Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief details about the resource..."
                  className="input-field"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="secondary-button px-4 py-2 text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={uploadLoading} className="primary-button px-5 py-2.5 text-sm">
                  {uploadLoading ? 'Uploading...' : 'Upload Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}