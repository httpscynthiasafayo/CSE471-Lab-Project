// app/web/src/components/PropertyPhotos.jsx
import { useCallback, useState } from "react";
import { api } from "../api/axios";

export default function PropertyPhotos({ propertyId, photos = [], canManage = false, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // ✅ sanitize: keep only non-empty strings
  const safePhotos = (Array.isArray(photos) ? photos : [])
    .filter((p) => typeof p === "string")
    .map((p) => p.trim())
    .filter(Boolean);

  const onFilesChosen = async (files) => {
    if (!files?.length) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("photos", f));
      const { data } = await api.post(`/properties/${propertyId}/photos`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange?.(data.photos || []);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback(
    async (e) => {
      e.preventDefault();
      if (!canManage) return;
      await onFilesChosen(e.dataTransfer?.files);
    },
    [canManage]
  );

  const onDelete = async (url) => {
    if (!url) return;
    const filename = url.split("/").pop();
    try {
      await api.delete(`/properties/${propertyId}/photos/${filename}`);
      onChange?.(safePhotos.filter((p) => p !== url));
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Delete failed");
    }
  };

  // simple reorder (drag-swap) – guard against bad data
  const [dragName, setDragName] = useState(null);
  const startDrag = (url) => url && setDragName(url.split("/").pop());
  const dropOn = async (url) => {
    if (!dragName || !url) return;
    const target = url.split("/").pop();
    if (!target || dragName === target) return;

    const names = safePhotos.map((p) => p.split("/").pop());
    const a = names.indexOf(dragName);
    const b = names.indexOf(target);
    if (a < 0 || b < 0) return;

    const order = [...names];
    [order[a], order[b]] = [order[b], order[a]];

    try {
      const { data } = await api.put(`/properties/${propertyId}/photos/order`, { order });
      onChange?.(data.photos || []);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Reorder failed");
    } finally {
      setDragName(null);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">Photos</h3>

      {canManage && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-purple-300 rounded-2xl p-6 text-center bg-white"
        >
          <p className="text-sm text-gray-600">Drag & drop images here, or</p>
          <label className="inline-block mt-2">
            <span className="btn cursor-pointer">Choose files</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onFilesChosen(e.target.files)}
            />
          </label>
          {uploading && <div className="mt-2 text-sm text-purple-700">Uploading…</div>}
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        </div>
      )}

      {safePhotos.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
          {safePhotos.map((url) => (
            <div
              key={url}
              className="relative rounded-2xl overflow-hidden shadow bg-white"
              draggable={canManage}
              onDragStart={() => startDrag(url)}
              onDrop={() => dropOn(url)}
              onDragOver={(e) => e.preventDefault()}
              title={url.split("/").pop()}
            >
              <img
                src={url}
                alt=""
                className="w-full h-36 object-cover"
                onError={(e) => {
                  // hide broken images gracefully
                  e.currentTarget.style.display = "none";
                }}
              />
              {canManage && (
                <button
                  onClick={() => onDelete(url)}
                  className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-4">No photos yet.</p>
      )}
    </div>
  );
}
