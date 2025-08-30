import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import Modal from './Modal';

function formatText(text = '') {
  // Preserve simple formatting: split on blank lines → paragraphs
  return text
    .split(/\n{2,}/g)
    .map((p, i) => <p key={i} className="leading-relaxed mb-3 whitespace-pre-line">{p}</p>);
}

export default function PostModal({ postId, open, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(postId));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !postId) return;
    setLoading(true);
    setError('');
    api.get(`/posts/${postId}`)
      .then((res) => setData(res.data))
      .catch((e) => setError(e?.response?.data?.error || 'Failed to load post'))
      .finally(() => setLoading(false));
  }, [postId, open]);

  const created = useMemo(() => data?.createdAt && new Date(data.createdAt).toLocaleDateString(), [data]);
  const updated = useMemo(() => data?.updatedAt && new Date(data.updatedAt).toLocaleDateString(), [data]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        {loading && (
          <div className="animate-pulse">
            <div className="h-6 w-2/3 bg-violet-100 rounded mb-4" />
            <div className="h-4 w-1/3 bg-violet-100 rounded mb-2" />
            <div className="h-32 w-full bg-violet-50 rounded" />
          </div>
        )}
        {error && (
          <div className="text-rose-600 bg-rose-50 border border-rose-200 rounded p-3">{error}</div>
        )}
        {!loading && !error && data && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-extrabold text-violet-900">{data.title}</h2>
              {data.type && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wide">
                  {data.type}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-sm mb-4">
              {data.country && <span className="px-2 py-1 rounded-full bg-indigo-100">📍 {data.country}</span>}
              {data.university && <span className="px-2 py-1 rounded-full bg-indigo-50">{data.university}</span>}
              {data.program && <span className="px-2 py-1 rounded-full bg-fuchsia-50">{data.program}</span>}
              {data.department && <span className="px-2 py-1 rounded-full bg-amber-50">{data.department}</span>}
              {data.term && <span className="px-2 py-1 rounded-full bg-teal-50">{data.term}</span>}
              {data.degreeType && <span className="px-2 py-1 rounded-full bg-sky-50">{data.degreeType}</span>}
              {Array.isArray(data.tags) && data.tags.map((t) => (
                <span key={t} className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">#{t}</span>
              ))}
            </div>

            <div className="prose max-w-none mb-6">{formatText(data.body)}</div>

            <div className="text-xs text-gray-500 flex justify-between">
              <span>Created: {created || '—'}</span>
              <span>Last updated: {updated || '—'}</span>
            </div>
          </>
        )}
        
      </div>
    </Modal>
  );
}
