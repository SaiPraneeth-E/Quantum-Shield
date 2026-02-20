import { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

export default function ConnectModal({ open, onClose }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);
    try {
      await axios.post(`${API}/api/contact`, { name, mobile, email, description });
      setMessage({ type: 'success', text: 'Message sent! I\'ll get back to you soon.' });
      setName('');
      setMobile('');
      setEmail('');
      setDescription('');
      setTimeout(() => {
        onClose();
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to send. Try again or email directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative cyber-panel w-full max-w-md p-8 md:p-10 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-cyan-400">Connect</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {message.text && (
            <p
              className={`text-sm py-2 px-3 rounded-lg ${
                message.type === 'success' ? 'bg-safe/20 text-safe' : 'bg-phishing/20 text-phishing'
              }`}
            >
              {message.text}
            </p>
          )}
          <div>
            <label className="block text-cyan-400/90 text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="cyber-input"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-cyan-400/90 text-sm font-medium mb-1">Mobile</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="cyber-input"
              placeholder="+91 9876543210"
            />
          </div>
          <div>
            <label className="block text-cyan-400/90 text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cyber-input"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-cyan-400/90 text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="cyber-input min-h-[100px] resize-y"
              placeholder="Your message or inquiry..."
              rows={4}
            />
          </div>
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[48px] rounded-xl border border-slate-600 text-slate-400 hover:bg-slate-800 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 cyber-btn text-white"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
