// app/web/src/components/ownercontact_popup_foruser.jsx
import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function OwnerContactPopupForUser({ open, onClose, propertyId }) {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  // Close with ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const sendRequest = async () => {
    try {
      setSending(true);
      setError("");
      const { data } = await api.post(`/properties/${propertyId}/request-contact`);
      setDone(true);
      setPreviewUrl(data?.previewUrl || null); // Ethereal preview (dev)
    } catch (e) {
      const msg = e?.response?.data?.error || e.message || "Failed to send email";
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {!done ? (
          <>
            <h3 className="text-lg font-semibold text-blue-900">Request owner contact?</h3>
            <p className="mt-2 text-sm text-blue-700">
              We’ll email you the landowner’s phone/WhatsApp/social for this listing.
            </p>

            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

            <div className="mt-6 flex justify-end gap-2">
              <button className="btn btn-ghost" onClick={onClose} disabled={sending}>Cancel</button>
              <button className="btn" onClick={sendRequest} disabled={sending}>
                {sending ? "Sending…" : "Confirm"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-green-700">Email sent!</h3>
            <p className="mt-2 text-sm text-blue-700">
              Check your inbox for the owner’s contact details.
              {previewUrl && (
                <>
                  {" "}In development you can also view it here:{" "}
                  <a href={previewUrl} target="_blank" rel="noreferrer" className="text-purple-700 underline">
                    Preview Email
                  </a>
                </>
              )}
            </p>
            <div className="mt-6 flex justify-end">
              <button className="btn" onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
