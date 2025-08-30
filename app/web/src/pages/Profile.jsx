// app/web/src/pages/Profile.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";

export default function Profile() {
  const { user, refresh } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");         // read-only
  const [cvUrl, setCvUrl] = useState("");         // server path to uploaded PDF

  // password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // PDF upload
  const [cvFile, setCvFile] = useState(null);
  const [cvPreview, setCvPreview] = useState(null); // object URL for preview

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setEmail(user.email || "");
    setCvUrl(user.cvUrl || "");      // existing uploaded PDF path if any
    // reset edit state
    setIsEditing(false);
    setCurrentPassword("");
    setNewPassword("");
    setCvFile(null);
    setCvPreview(null);
    setMsg("");
    setErr("");
  }, [user]);

  const canSave = useMemo(() => {
    // If changing password, current password is required
    if (newPassword && !currentPassword) return false;
    return true;
  }, [newPassword, currentPassword]);

  function onChooseCv(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErr("Please upload a PDF file.");
      return;
    }
    setErr("");
    setCvFile(file);
    setCvPreview(URL.createObjectURL(file));
  }

  async function uploadCvIfNeeded() {
    if (!cvFile) return null;
    const fd = new FormData();
    fd.append("cv", cvFile);
    const { data } = await api.post("/me/cv", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data?.cvUrl || null;
  }

  async function onSave(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      // 1) upload pdf if a new one is selected
      const newCv = await uploadCvIfNeeded();

      // 2) send profile + optional password change
      const payload = {
        name,
        ...(newCv ? { cvUrl: newCv } : {}),
        ...(newPassword ? { currentPassword, newPassword } : {}),
      };

      await api.put("/me", payload);
      await refresh();

      setIsEditing(false);
      setCurrentPassword("");
      setNewPassword("");
      setCvFile(null);
      setCvPreview(null);

      setMsg("Profile updated");
      setTimeout(() => setMsg(""), 1800);
    } catch (e2) {
      setErr(e2?.response?.data?.error || e2.message || "Failed to update profile");
    }
  }

  function onCancel() {
    setName(user?.name || "");
    setCvUrl(user?.cvUrl || "");
    setIsEditing(false);
    setCurrentPassword("");
    setNewPassword("");
    setCvFile(null);
    setCvPreview(null);
    setErr("");
  }

  const previewSrc = cvPreview || cvUrl || null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow border border-purple-100 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-purple-800">My Profile</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-2xl bg-purple-600 text-white shadow hover:shadow-lg hover:opacity-90 transition"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                type="button"
                className="px-4 py-2 rounded-2xl border border-gray-300 bg-white text-gray-700 shadow-sm hover:shadow"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={!canSave}
                className={`px-4 py-2 rounded-2xl text-white shadow transition ${
                  canSave ? "bg-purple-600 hover:shadow-lg hover:opacity-90" : "bg-purple-300 cursor-not-allowed"
                }`}
              >
                Save
              </button>
            </div>
          )}
        </div>

        {msg && <div className="mt-4 text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">{msg}</div>}
        {err && <div className="mt-4 text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{err}</div>}

        {/* Form */}
        <form className="mt-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              disabled={!isEditing}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-600"
              disabled
              value={email}
              readOnly
            />
          </div>

          {/* CV/Resume (PDF) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume / CV (PDF)</label>

            {!isEditing ? (
              <div className="space-y-2">
                {previewSrc ? (
                  <>
                    <a href={`${import.meta.env.VITE_API_URL}${cvUrl}`} target="_blank" rel="noreferrer" className="text-purple-700 underline">
                      Open in new tab
                    </a>
                    <div className="rounded-2xl overflow-hidden border">
                      <iframe title="cv-preview" src={`${import.meta.env.VITE_API_URL}${cvUrl}`} className="w-full h-80" />
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">No CV uploaded yet.</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={onChooseCv}
                  className="block w-full text-sm text-gray-700
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-xl file:border-0
                             file:text-sm file:font-medium
                             file:bg-purple-600 file:text-white
                             hover:file:opacity-90"
                />
                {previewSrc && (
                  <div className="rounded-2xl overflow-hidden border">
                    <iframe title="cv-preview" src={previewSrc.startsWith("blob:") ? previewSrc : `${import.meta.env.VITE_API_URL}${previewSrc}`} className="w-full h-80" />
                  </div>
                )}
                {!previewSrc && cvUrl && <p className="text-xs text-gray-500">Current file: {cvUrl}</p>}
              </div>
            )}
          </div>

          {/* Change password (shown only while editing) */}
          {isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current password {newPassword ? <span className="text-red-500">*</span> : "(required only if changing password)"}
                </label>
                <input
                  type="password"
                  className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New password (optional)</label>
                <input
                  type="password"
                  className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a new password"
                />
                {newPassword && !currentPassword && (
                  <p className="mt-1 text-xs text-red-600">Current password is required to change your password.</p>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
