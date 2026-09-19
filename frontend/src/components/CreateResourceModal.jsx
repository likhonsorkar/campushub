import { useState, useEffect } from 'react';
import { createResource, getDepartments, getSubjects } from '../services/resourceService';

export default function CreateResourceModal({ isOpen, onClose, onResourceCreated }) {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      Promise.all([getDepartments(), getSubjects()])
        .then(([deptRes, subjRes]) => {
          setDepartments(deptRes.data);
          setSubjects(subjRes.data);
        })
        .catch((err) => console.error('Failed to load categories:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter subjects based on selected department
  const filteredSubjects = selectedDept
    ? subjects.filter((s) => s.department === Number(selectedDept))
    : subjects;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject) {
      setError('Please select a subject.');
      return;
    }
    if (!formData.file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError('');

    // Prepare FormData for Multipart Submission
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('resource_type', formData.resource_type);
    data.append('subject', formData.subject);
    data.append('file', formData.file);

    try {
      await createResource(data);
      onResourceCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload resource.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800">Upload Academic Resource</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        {error && <div className="p-3 mb-4 text-xs text-red-600 bg-red-50 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Data Structures Midterm Notes"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-xs font-semibold text-slate-600 mb-1">Subject</label>
              <select
                required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="">Select Subject</option>
                {filteredSubjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Resource Type</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.resource_type}
                onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
              >
                <option value="NOTE">📘 Lecture Note</option>
                <option value="QUESTION">📝 Question Paper</option>
                <option value="BOOK">📚 Book / PDF</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">File Attachment</label>
              <input
                type="file"
                required
                className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Brief details about the resource..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              {loading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}