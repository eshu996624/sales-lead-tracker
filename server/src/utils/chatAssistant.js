const companyContent = require('../data/companyContent');

const summarizeText = (text) => text;

const createResponse = (question, queryData, user) => {
  const keywords = question.toLowerCase();
  if (keywords.includes('performance') || keywords.includes('student')) {
    return `I can help review student performance insights. Based on uploaded data, you have ${queryData.totalRecords || 0} records and ${queryData.schoolCount || 0} school entries. Ask me for trend details or upload more CSV data to expand analysis.`;
  }
  if (keywords.includes('services') || keywords.includes('qwings')) {
    return `Qwings offers school profile management, CSV data validation, lead tracking, AI chat support, and analytics dashboards. Our services are designed for principals and sales representatives collaborating on school partnerships.`;
  }
  if (keywords.includes('upload') || keywords.includes('csv')) {
    return `Your CSV upload system stores each file with validation and searchable records. You can upload school data, then filter and analyze it from the admin dashboard.`;
  }
  if (keywords.includes('dashboard') || keywords.includes('analytics')) {
    return `The dashboard provides summaries for total uploads, recent submissions, school analytics, and lead progress. For sales, it also shows conversions by status and monthly growth.`;
  }
  if (keywords.includes('contact') || keywords.includes('support')) {
    return `For support, email ${companyContent.contact.email} or call ${companyContent.contact.phone}. Our team is ready to help with Qwings setup, onboarding, and data management.`;
  }

  return `Hi ${user.name}, I am your Qwings assistant. Ask me about school profiles, CSV uploads, lead status, or Qwings services and I will answer using your company context.`;
};

exports.answerQuery = async ({ question, user, queryData }) => {
  return {
    query: question,
    response: createResponse(question, queryData, user),
    source: 'qwings-helper'
  };
};
