import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const { user } = useAuth()
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({ title:'', body:'', country:'', type:'SOP' })

  useEffect(()=> {
    api.get(`/posts/${id}`).then(({data}) => {
      setPost(data)
      setForm({ title: data.title, body: data.body, country: data.country || '', type: data.type })
    })
  }, [id])

  const save = async () => {
    await api.put(`/posts/${id}`, form)
    const { data } = await api.get(`/posts/${id}`)
    setPost(data); setEdit(false)
  }

  if (!post) return <div>Loading...</div>

  return (
    <div className="card">
      {!edit ? (
        <>
          <h2 className="text-2xl font-semibold text-blue-800">{post.title}</h2>
          <div className="text-sm text-blue-600 mb-3">{post.type} {post.country && `• ${post.country}`}</div>
          <p className="whitespace-pre-line text-blue-900">{post.body}</p>
          {user?.role === 'admin' && <button className="btn mt-4" onClick={()=>setEdit(true)}>Edit</button>}
        </>
      ) : (
        <div className="space-y-2">
          <input className="input" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/>
          <input className="input" value={form.country} onChange={e=>setForm(p=>({...p,country:e.target.value}))}/>
          <select className="input" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
            <option>SOP</option><option>VISA</option>
          </select>
          <textarea className="input" rows={8} value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))}/>
          <button className="btn" onClick={save}>Save</button>
          <button className="btn ml-2" onClick={()=>setEdit(false)}>Cancel</button>
        </div>
      )}
    </div>
  )
}
