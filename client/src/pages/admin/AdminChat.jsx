import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminChat = () => {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    try {
      const res = await api.get('/chat/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleAsk = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await api.post('/chat/assistant', { question });
      setQuestion('');
      setMessage('Response saved to history.');
      setHistory((prev) => [{ ...res.data.chat, response: res.data.response, query: question }, ...prev]);
    } catch (err) {
      setMessage('Unable to send your question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">AI Query Assistant</h1>
        <p className="mt-2 text-slate-600">Ask questions about school data, uploaded CSVs, or Qwings services.</p>
      </div>
      <form onSubmit={handleAsk} className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="grid gap-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows="4"
            className="w-full rounded-3xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
            placeholder="Ask about student performance, CSV uploads, or lead analytics"
          />
          <button type="submit" disabled={loading} className="w-fit rounded-full bg-brand-blue px-6 py-3 text-white hover:bg-brand-aqua">
            {loading ? 'Processing...' : 'Ask Assistant'}
          </button>
          {message && <div className="rounded-3xl bg-brand-blue/10 p-4 text-brand-blue">{message}</div>}
        </div>
      </form>
      <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
        <h2 className="text-xl font-semibold">Chat History</h2>
        <div className="mt-6 space-y-5">
          {history.length ? history.map((item) => (
            <div key={item._id || item.query} className="rounded-3xl border border-slate-200 p-5">
              <p className="font-semibold text-slate-900">You: {item.query}</p>
              <p className="mt-3 text-slate-700">Assistant: {item.response}</p>
              <p className="mt-3 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
          )) : <p className="text-slate-500">Ask a question to start the assistant.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
