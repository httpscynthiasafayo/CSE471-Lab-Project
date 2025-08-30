import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/axios'
import OwnerContactPopupForUser from '../components/ownercontact_popup_foruser'
import LandownerContactPopup from '../components/ownercontact_upload_landowner.jsx'

export default function HousingDetail() {
  const { id } = useParams()

  const [prop, setProp] = useState(null)
  const [me, setMe] = useState(null)           // ← signed-in user
  const [loadingMe, setLoadingMe] = useState(true)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({})
  const [showContactPopup, setShowContactPopup] = useState(false)

  // who owns it?
  const isOwner = useMemo(() => {
    if (!me || !prop) return false
    const byId = prop.owner && me.id && String(prop.owner) === String(me.id) // if API returns `owner`
    const byOwnerId = prop.ownerId && me.id && String(prop.ownerId) === String(me.id)
    const byEmail =
      prop.ownerEmail && me.email && prop.ownerEmail.toLowerCase() === me.email.toLowerCase()
    return byId || byOwnerId || byEmail
  }, [me, prop])

  const isLandowner = me?.role === 'landowner'

  // fetch current user (adjust endpoint/shape to your API)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await api.get('/me')
        if (mounted) setMe(data)
      } catch {
        if (mounted) setMe(null) // Not logged in
      } finally {
        if (mounted) setLoadingMe(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  // fetch property by id
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await api.get(`/properties/${id}`)
      if (!mounted) return
      setProp(data)
      setForm({
        title: data.title,
        location: data.location,
        price: data.price,
        type: data.type,
        description: data.description || '',
        amenities: (data.amenities || []).join(', '),
        terms: data.terms || '',
        isRented: data.isRented || false,
      })
    })()
    return () => { mounted = false }
  }, [id])

  // Determine edit permission: admin OR listing owner
  const canEdit = useMemo(() => {
    if (!me || !prop) return false
    const isAdmin = me.role === 'admin'
    const isOwnerById = prop.ownerId && me.id && String(prop.ownerId) === String(me.id)
    const isOwnerByEmail =
      prop.ownerEmail && me.email && prop.ownerEmail.toLowerCase() === me.email.toLowerCase()
    return isAdmin || isOwnerById || isOwnerByEmail
  }, [me, prop])

  const save = async () => {
    if (!canEdit) return // client guard; server should also enforce (403)
    const payload = {
      ...form,
      price: Number(form.price),
      amenities: form.amenities
        ? form.amenities.split(',').map(s => s.trim()).filter(Boolean)
        : []
    }
    await api.put(`/properties/${id}`, payload)
    const { data } = await api.get(`/properties/${id}`)
    setProp(data)
    setEdit(false)
  }

  if (!prop || loadingMe) return <div>Loading...</div>

  // ---------- UI flags (UI-only change) ----------
  const isAdmin = me?.role === 'admin'
  const showEditButton = canEdit                         // admin OR owner
  const showUploadButton = isLandowner                   // ANY landowner sees this
  const showRequestButton = !isLandowner && !isOwner && !isAdmin // non-landowner, non-owner, non-admin
  // ------------------------------------------------

  return (
    <div className="card">
      {!edit ? (
        <>
          <h2 className="text-2xl font-semibold text-blue-800">{prop.title}</h2>
          <div className="text-sm text-blue-600">{prop.location} • {prop.type} • ${prop.price}/week</div>
          {prop.isRented && <div className="badge mt-2">Rented</div>}
          <p className="mt-3 whitespace-pre-line">{prop.description}</p>
          {!!prop.amenities?.length && <div className="mt-2 text-sm">Amenities: {prop.amenities.join(', ')}</div>}

          {/* Actions */}
          {(showEditButton || showUploadButton) && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {showEditButton && (
                <button className="btn" onClick={() => setEdit(true)}>Edit</button>
              )}
              {showUploadButton && (
                <button className="btn" onClick={() => setShowContactPopup(true)}>
                  Upload your contact info
                </button>
              )}
            </div>
          )}

          {/* Non-owner / non-landowner request */}
          {showRequestButton && (
            <button className="btn mt-4" onClick={() => setShowContactPopup(true)}>
              Request for owner contact
            </button>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1" htmlFor="title">Title</label>
            <input id="title" className="input" value={form.title}
                   onChange={e=>setForm(p=>({...p,title:e.target.value}))}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1" htmlFor="city">City</label>
            <input id="city" className="input" value={form.location}
                   onChange={e=>setForm(p=>({...p,location:e.target.value}))}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1" htmlFor="price">Rent per week</label>
            <input id="price" type="number" min="0" step="1" className="input" value={form.price}
                   onChange={e=>setForm(p=>({...p,price:e.target.value}))}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1" htmlFor="type">Property type</label>
            <select id="type" className="input" value={form.type}
                    onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
              <option>Apartment</option><option>Room</option><option>Studio</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1" htmlFor="amenities">Amenities</label>
            <input id="amenities" className="input" value={form.amenities}
                   onChange={e=>setForm(p=>({...p,amenities:e.target.value}))} placeholder="Comma-separated"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1" htmlFor="description">Description</label>
            <textarea id="description" className="input" rows={3} value={form.description}
                      onChange={e=>setForm(p=>({...p,description:e.target.value}))}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1" htmlFor="terms">Terms</label>
            <textarea id="terms" className="input" rows={2} value={form.terms}
                      onChange={e=>setForm(p=>({...p,terms:e.target.value}))}/>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={!!form.isRented}
                   onChange={e=>setForm(p=>({...p,isRented:e.target.checked}))}/>
            <span>Mark as Rented</span>
          </label>
          <div className="pt-2">
            <button className="btn" onClick={save}>Save</button>
            <button className="btn ml-2" onClick={()=>setEdit(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Popups: mount at most one */}
      {showUploadButton ? (
        <LandownerContactPopup
          open={showContactPopup}
          onClose={() => setShowContactPopup(false)}
          me={me}
        />
      ) : showRequestButton ? (
        <OwnerContactPopupForUser
          open={showContactPopup}
          onClose={() => setShowContactPopup(false)}
          propertyId={id}
        />
      ) : null}
    </div>
  )
}
