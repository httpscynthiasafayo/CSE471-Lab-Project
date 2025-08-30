import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "../api/axios"

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`)
        setPost(res.data)
      } catch (err) {
        console.error("Failed to load post", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!post) {
    return <div className="p-6">Post not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 rounded-2xl bg-purple-600 text-white shadow hover:shadow-lg hover:opacity-90 transition"
      >
        ← Back to Guides
      </button>

      <div className="bg-purple-200/70 rounded-3xl p-6 shadow">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-900 mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-4 text-sm">
          <span className="px-2 py-1 rounded-full bg-white/70">{post.type}</span>
          {post.country && (
            <span className="px-2 py-1 rounded-full bg-white/70">
              📍 {post.country}
            </span>
          )}
          {Array.isArray(post.tags) &&
            post.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 rounded-full bg-white/70">
                #{tag}
              </span>
            ))}
        </div>

        <article className="whitespace-pre-wrap leading-7 text-purple-900">
          {post.body || post.content}
        </article>

        <div className="mt-6 text-xs opacity-70">
          {post.createdAt && (
            <div>Created: {new Date(post.createdAt).toLocaleDateString()}</div>
          )}
          {post.updatedAt && (
            <div>Last updated: {new Date(post.updatedAt).toLocaleDateString()}</div>
          )}
        </div>
      </div>
    </div>
  )
}
