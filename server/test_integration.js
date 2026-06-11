const fs = require('fs');
const fetch = global.fetch || require('node-fetch');
const path = require('path');

const base = 'http://127.0.0.1:5000/api';
const tempCsv = path.join(__dirname, 'tmp_test.csv');
fs.writeFileSync(tempCsv, 'school name,contact no,address,state,city,country\nTest School,1234567890,123 Main St,TestState,TestCity,TestCountry\n');

(async () => {
  try {
    console.log('health...');
    let res = await fetch(`${base}/health`);
    console.log('health', res.status, await res.text());

    console.log('seed...');
    res = await fetch(`${base}/auth/seed`);
    console.log('seed', res.status, await res.text());

    console.log('admin login...');
    res = await fetch(`${base}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'principal@qwings.com', password: 'Admin@1234' }) });
    const adminLogin = await res.json();
    console.log('admin login', res.status, adminLogin);
    const adminToken = adminLogin.token;
    if (!adminToken) throw new Error('Admin login failed');

    console.log('admin profile get...');
    res = await fetch(`${base}/admin/profile`, { headers: { Authorization: `Bearer ${adminToken}` } });
    console.log('profile', res.status, await res.text());

    console.log('admin upload csv...');
    const form = new (require('form-data'))();
    form.append('file', fs.createReadStream(tempCsv));
    res = await fetch(`${base}/admin/upload-csv`, { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: form });
    const uploadRes = await res.json();
    console.log('upload', res.status, uploadRes);

    console.log('admin analytics...');
    res = await fetch(`${base}/admin/analytics`, { headers: { Authorization: `Bearer ${adminToken}` } });
    console.log('analytics', res.status, await res.json());

    console.log('sales login...');
    res = await fetch(`${base}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'sales@qwings.com', password: 'Sales@1234' }) });
    const salesLogin = await res.json();
    console.log('sales login', res.status, salesLogin);
    const salesToken = salesLogin.token;
    if (!salesToken) throw new Error('Sales login failed');

    console.log('create lead...');
    res = await fetch(`${base}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${salesToken}` },
      body: JSON.stringify({ schoolName: 'Lead School', contactPerson: 'Principal Person', phoneNumber: '0987654321', email: 'lead@test.com', address: '456 Side St', state: 'LeadState', city: 'LeadCity', notes: 'Test lead', followUpDate: '2026-06-15', status: 'Hot Lead' })
    });
    const leadRes = await res.json();
    console.log('create lead', res.status, leadRes);

    console.log('get leads...');
    res = await fetch(`${base}/leads`, { headers: { Authorization: `Bearer ${salesToken}` } });
    console.log('leads', res.status, await res.text());

    console.log('sales stats...');
    res = await fetch(`${base}/leads/stats`, { headers: { Authorization: `Bearer ${salesToken}` } });
    console.log('stats', res.status, await res.json());

    fs.unlinkSync(tempCsv);
    console.log('integration test complete');
  } catch (err) {
    console.error('ERROR', err);
  }
})();
