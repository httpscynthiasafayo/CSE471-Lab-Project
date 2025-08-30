import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/axios';

export default function LandownerContactPopup({ open, onClose, me }) {
  const [phone, setPhone] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [socialUrl, setSocialUrl] = useState('');

  const [initial, setInitial] = useState({ phone: '', whatsappUrl: '', socialUrl: '' });
  const [mode, setMode] = useState('edit'); // 'edit' | 'view'
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // is this the first time user is adding info?
  const hasInitial = useMemo(() => {
    return !!(initial.phone?.trim() || initial.whatsappUrl?.trim() || initial.socialUrl?.trim());
  }, [initial]);

  // have values changed?
  const dirty = useMemo(() => {
    return (
      (phone ?? '').trim() !== (initial.phone ?? '') ||
      (whatsappUrl ?? '').trim() !== (initial.whatsappUrl ?? '') ||
      (socialUrl ?? '').trim() !== (initial.socialUrl ?? '')
    );
  }, [phone, whatsappUrl, socialUrl, initial]);

  useEffect(() => {
    if (!open) return;
    // hydrate from 'me' when opening
    const p = me?.phone || '';
    const w = me?.whatsappUrl || '';
    const s = me?.socialUrl || '';
    setPhone(p);
    setWhatsappUrl(w);
    setSocialUrl(s);
    setInitial({ phone: p, whatsappUrl: w, socialUrl: s });
    setError('');
    // Logic 1: first time → show only Save (i.e., start in edit)
    // Otherwise show the info with an Edit button (view mode)
    setMode(p || w || s ? 'view' : 'edit');
  }, [open, me]);

  if (!open) return null;

  const normalizeWhatsapp = (value) => {
    if (!value) return '';
    const trimmed = value.trim();
    // if only digits, convert to wa.me/<digits>
    if (/^\d{8,15}$/.test(trimmed)) return `https://wa.me/${trimmed}`;
    return trimmed;
  };

  const submit = async () => {
    try {
      setSaving(true);
      setError('');

      const payload = {
        phone: (phone || '').trim(),
        whatsappUrl: normalizeWhatsapp(whatsappUrl),
        socialUrl: (socialUrl || '').trim(),
      };

      const res = await api.put('/me/contact', payload); // requires api route
      // Update local initial snapshot with what we just saved
      setInitial(payload);
      // Logic 2/4: after saving → go to view mode (Save disappears)
      setMode('view');
    } catch (e) {
      const status = e?.response?.status;
      if (status === 404) {
        setError('Endpoint /api/me/contact not found. Add the api route for saving contact info.');
      } else if (status === 401) {
        setError('Please log in as a landowner to save contact info.');
      } else {
        setError(e?.response?.data?.error || 'Failed to save contact info');
      }
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    // Logic 3: Cancel in edit → if user had info before, revert & show view; else close
    if (hasInitial) {
      setPhone(initial.phone || '');
      setWhatsappUrl(initial.whatsappUrl || '');
      setSocialUrl(initial.socialUrl || '');
      setMode('view');
      setError('');
    } else {
      onClose?.();
    }
  };

  const toHttp = (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md">
        <h3 className="text-lg font-semibold">Upload your contact info</h3>

        {mode === 'view' ? (
          <>
            <div className="mt-4 space-y-2 text-sm">
              <div><span className="font-medium">Phone:</span> {initial.phone || <em>Not set</em>}</div>
              <div>
                <span className="font-medium">WhatsApp:</span>{' '}
                {initial.whatsappUrl ? (
                  <a className="text-blue-600 underline" href={toHttp(initial.whatsappUrl)} target="_blank" rel="noreferrer">
                    {initial.whatsappUrl}
                  </a>
                ) : <em>Not set</em>}
              </div>
              <div>
                <span className="font-medium">Social:</span>{' '}
                {initial.socialUrl ? (
                  <a className="text-blue-600 underline" href={toHttp(initial.socialUrl)} target="_blank" rel="noreferrer">
                    {initial.socialUrl}
                  </a>
                ) : <em>Not set</em>}
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              {/* Logic 2: after saving, show Edit button */}
              <button className="btn" onClick={() => setMode('edit')}>Edit</button>
              <button className="btn btn-ghost" onClick={onClose}>Close</button>
            </div>
          </>
        ) : (
          <>
            <label className="block text-sm mt-3 mb-1">Phone</label>
            <input
              className="w-full border rounded p-2"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 555-123-4567"
            />

            <label className="block text-sm mt-3 mb-1">WhatsApp (URL or number)</label>
            <input
              className="w-full border rounded p-2"
              value={whatsappUrl}
              onChange={e => setWhatsappUrl(e.target.value)}
              placeholder="https://wa.me/15551234567"
            />

            <label className="block text-sm mt-3 mb-1">Social profile URL (optional)</label>
            <input
              className="w-full border rounded p-2"
              value={socialUrl}
              onChange={e => setSocialUrl(e.target.value)}
              placeholder="https://instagram.com/username"
            />

            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

            <div className="mt-4 flex gap-2">
              {/* Logic 1/3/4: Save appears only in edit mode; disable if nothing changed */}
              <button className="btn" onClick={submit} disabled={saving || !dirty}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
