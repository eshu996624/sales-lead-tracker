import { useEffect, useState } from 'react';
import api from '../../services/api';

const CsvUploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadUploads = async () => {
    try {
      const res = await api.get('/admin/uploads', { params: { search } });
      setUploads(res.data.uploads);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUploads();
  }, [search]);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please select a CSV file.');
      return;
    }
    const data = new FormData();
    data.append('file', file);
    setLoading(true);
    try {
      const res = await api.post('/admin/upload-csv', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage(res.data.message);
      setFile(null);
      loadUploads();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">CSV Upload Module</h1>
        <p className="mt-2 text-slate-600">Upload and validate school data CSVs, then review records in the table below.</p>
      </div>
      <div className="rounded-3xl border border-slate-200/50 bg-slate-50/80 p-6 text-slate-700">
        <p className="font-semibold">CSV Requirements</p>
        <p className="mt-2 text-sm">Your CSV should include these columns:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          <li>contact no</li>
          <li>school name</li>
          <li>address</li>
          <li>city</li>
          <li>country</li>
          <li>state</li>
        </ul>
      </div>
      <form onSubmit={handleUpload} className="grid gap-6 rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        {message && <div className="rounded-3xl bg-brand-blue/10 p-4 text-brand-blue">{message}</div>}
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="block text-sm font-medium text-slate-700">
            Select CSV file
            <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-2 block w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900" />
          </label>
          <button disabled={loading} className="rounded-full bg-brand-blue px-6 py-3 text-white hover:bg-brand-aqua">
            {loading ? 'Uploading...' : 'Upload CSV'}
          </button>
        </div>
      </form>
      <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Uploaded Records</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs rounded-3xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
            placeholder="Search by filename"
          />
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Filename</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Records</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {uploads.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-4 text-slate-800">{item.filename}</td>
                  <td className="px-4 py-4 text-slate-800">{item.recordCount}</td>
                  <td className="px-4 py-4 text-slate-600">{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {!uploads.length && (
                <tr>
                  <td colSpan="3" className="px-4 py-6 text-center text-slate-500">No upload records yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CsvUploadPage;
