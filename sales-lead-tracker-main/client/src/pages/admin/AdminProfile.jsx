import { useEffect, useState } from 'react';
import api from '../../services/api';

const defaultProfile = {
  schoolName: '',
  principalName: '',
  contactNumber: '',
  email: '',
  address: '',
  state: '',
  city: '',
  country: ''
};

const AdminProfile = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/admin/profile');
        if (res.data) setProfile({ ...defaultProfile, ...res.data });
      } catch (error) {
        console.error(error);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (key, value) => setProfile((prev) => ({ ...prev, [key]: value }));

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      await api.post('/admin/profile', profile);
      setMessage('Profile saved successfully.');
    } catch (error) {
      setMessage('Unable to save profile.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">School Profile</h1>
        <p className="mt-2 text-slate-600">Manage your school details and principal contact information.</p>
      </div>
      <form onSubmit={saveProfile} className="grid gap-6 rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        {message && <div className="rounded-3xl bg-brand-blue/10 p-4 text-brand-blue">{message}</div>}
        <div className="grid gap-5 md:grid-cols-2">
          {['schoolName', 'principalName', 'contactNumber', 'email', 'address', 'city', 'state', 'country'].map((field) => (
            <label key={field} className="block text-sm font-medium text-slate-700">
              {field === 'schoolName'
                ? 'School Name'
                : field === 'principalName'
                ? 'Principal Name'
                : field === 'contactNumber'
                ? 'Contact Number'
                : field === 'email'
                ? 'Email'
                : field === 'address'
                ? 'Address'
                : field === 'city'
                ? 'City'
                : 'State'}
              <input
                value={profile[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
                type={field === 'email' ? 'email' : 'text'}
                required
              />
            </label>
          ))}
        </div>
        <button type="submit" className="w-fit rounded-full bg-brand-blue px-6 py-3 text-white hover:bg-brand-aqua">Save Profile</button>
      </form>
    </div>
  );
};

export default AdminProfile;
