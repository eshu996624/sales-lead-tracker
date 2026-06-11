const csv = require('csv-parser');
const fs = require('fs');

const fieldMap = {
  'contact no': 'contactNumber',
  'contactnumber': 'contactNumber',
  'contact number': 'contactNumber',
  'school name': 'schoolName',
  'schoolname': 'schoolName',
  address: 'address',
  city: 'city',
  country: 'country',
  state: 'state'
};

exports.parseCsvFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const normalized = {};
        Object.entries(data).forEach(([key, value]) => {
          const lookup = key.trim().toLowerCase();
          const normalizedKey = fieldMap[lookup];
          if (normalizedKey) normalized[normalizedKey] = value?.toString().trim() || '';
        });
        results.push(normalized);
      })
      .on('end', () => {
        const missingIndex = results.findIndex((row) => !row.contactNumber || !row.schoolName || !row.address || !row.city || !row.country || !row.state);
        if (missingIndex !== -1) {
          return reject(new Error(`CSV row ${missingIndex + 1} is missing one of the required fields: contact no, school name, address, city, country, state.`));
        }
        resolve(results);
      })
      .on('error', (error) => reject(error));
  });
};
