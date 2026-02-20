import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '';

export default function History() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    axios
      .get(`${API}/api/predict/history`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(({ data }) => setList(data))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [getToken]);

  if (loading) {
    return (
      <div className="animate-fade-in flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-cyan-500/50 border-t-cyan-400 animate-spin" />
          <p className="text-slate-500">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="page-heading">
        SCAN <span className="text-cyan-400">HISTORY</span>
      </h1>
      <p className="page-subheading">Past URL scans and verdicts</p>

      {list.length === 0 ? (
        <div className="cyber-panel p-12 md:p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-slate-800 flex items-center justify-center text-slate-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-500">No predictions yet.</p>
          <p className="text-slate-600 text-sm mt-1">Run a scan from the Predict page.</p>
        </div>
      ) : (
        <div className="cyber-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="cyber-table w-full text-left">
              <thead>
                <tr className="border-b border-cyan-500/20 bg-slate-800/50">
                  <th className="px-5 py-4 text-cyan-400/90 font-display text-sm font-medium">URL</th>
                  <th className="px-5 py-4 text-cyan-400/90 font-display text-sm font-medium">Result</th>
                  <th className="px-5 py-4 text-cyan-400/90 font-display text-sm font-medium">Confidence</th>
                  <th className="px-5 py-4 text-cyan-400/90 font-display text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {list.map((row, i) => (
                  <tr
                    key={row._id}
                    className="border-b border-slate-700/50"
                    style={{ animationDelay: `${i * 0.03}s` }}
                  >
                    <td className="px-5 py-4 text-slate-300 font-mono text-sm truncate max-w-xs">
                      {row.inputUrl}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${
                          row.prediction === 'phishing'
                            ? 'bg-phishing/20 text-phishing border border-phishing/40'
                            : 'bg-safe/20 text-safe border border-safe/40'
                        }`}
                      >
                        {row.prediction}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-cyan-400 font-mono text-sm">
                      {Math.round(row.confidence * 100)}%
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-sm">
                      {new Date(row.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
