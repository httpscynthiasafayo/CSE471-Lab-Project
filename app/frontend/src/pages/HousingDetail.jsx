import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/axios'

export default function HousingDetail() {
  const { id } = useParams()
  const [prop, setProp] = useState(null)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({})

  useEffect(()=> {
    api.get(`/properties/${id}`).then(({data})=>{
      setProp(data)
      setForm({
        title: data.title, location: data.location, price: data.price,
        type: data.type, description: data.description || '', amenities: (data.amenities||[]).join(', '),
        terms: data.terms || '', isRented: data.isRented || false
      })
    })
  }, [id])

  const save = async () => {
    const payload = { ...form, price: Number(form.price), amenities: form.amenities ? form.amenities.split(',').map(s=>s.trim()) : [] }
    await api.put(`/properties/${id}`, payload)
    const { data } = await api.get(`/properties/${id}`); setProp(data); setEdit(false)
  }

  if (!prop) return <div>Loading...</div>

  return (
    <div className="card">
      {!edit ? (
        <>
          <h2 className="text-2xl font-semibold text-blue-800">{prop.title}</h2>
          <div className="text-sm text-blue-600">{prop.location} • {prop.type} • ${prop.price}</div>
          {prop.isRented && <div className="badge mt-2">Rented</div>}
          <p className="mt-3 whitespace-pre-line">{prop.description}</p>
          {!!prop.amenities?.length && <div className="mt-2 text-sm">Amenities: {prop.amenities.join(', ')}</div>}
          {/** show edit toggle only if user is admin (simple client-side check via 403 on save is also fine) */}
          <button className="btn mt-4" onClick={()=>setEdit(true)}>Edit</button>
        </>
      ) : (
        <div className="space-y-2">
          <input className="input" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/>
          <input className="input" value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))}/>
          <input className="input" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))}/>
          <select className="input" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
            <option>Apartment</option><option>Room</option><option>Studio</option>
          </select>
          <input className="input" value={form.amenities} onChange={e=>setForm(p=>({...p,amenities:e.target.value}))} placeholder="Amenities (comma)" />
          <textarea className="input" rows={3} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/>
          <input className="input" value={form.terms} onChange={e=>setForm(p=>({...p,terms:e.target.value}))}/>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={!!form.isRented} onChange={e=>setForm(p=>({...p,isRented:e.target.checked}))}/>
            <span>Mark as Rented</span>
          </label>
          <button className="btn" onClick={save}>Save</button>
          <button className="btn ml-2" onClick={()=>setEdit(false)}>Cancel</button>
        </div>
      )}
    </div>
  )
}
