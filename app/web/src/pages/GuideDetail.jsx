import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Detail page for a single Guide/Post
 * Expects backend route: GET /api/posts/:id
 */
export default function GuideDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        if(!id) throw new Error("No post ID provided");
        else {
            
        }
        setStatus("loading");
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || `Failed to load post (${res.status})`);
        }
        const data = await res.json();
        if (alive) {
          setPost(data);
          setStatus("ready");
        }
      } catch (e) {
        if (alive) {
          setError(e.message);
          setStatus("error");
        }
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse h-8 w-64 rounded bg-gray-200 mb-6" />
        <div className="animate-pulse h-64 rounded bg-gray-100" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-2xl shadow border hover:shadow-md transition"
        >
          ← Back
        </button>
        <p className="mt-6 text-red-600 font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50/60">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-purple-200/70 rounded-3xl p-6 md:p-8 shadow">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            {post?.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap gap-2 mb-4 text-sm">
            {post?.type && (
              <span className="px-2 py-1 rounded-full bg-white/70">
                {post.type}
              </span>
            )}
            {post?.country && (
              <span className="px-2 py-1 rounded-full bg-white/70">
                📍 {post.country}
              </span>
            )}
            {Array.isArray(post?.tags) &&
              post.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 rounded-full bg-white/70"
                >
                  #{t}
                </span>
              ))}
          </div>

          {/* Content */}
          <article className="prose max-w-none">
            {/* If your content is HTML/markdown-rendered elsewhere, replace with a renderer */}
            <pre className="whitespace-pre-wrap font-sans text-[15px] leading-7">
              {post?.body}
            </pre>

          </article>

          {/* Dates */}
          <div className="mt-6 text-xs opacity-70">
            {post?.createdAt && (
              <div>Created: {new Date(post.createdAt).toLocaleDateString()}</div>
            )}
            {post?.updatedAt && (
              <div>
                Last updated: {new Date(post.updatedAt).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-2xl bg-purple-600 text-white shadow hover:shadow-lg hover:opacity-90 transition"
            >
              ← Back to SOP Hub
            </button>
          </div>
        </div>

        {/* footer style similar to your screenshot */}
        <div className="text-center text-xs mt-6 opacity-70">
          © {new Date().getFullYear()} AbroadEase. All rights reserved.
        </div>
      </div>
    </div>
  );
}
