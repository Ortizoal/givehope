import { useEffect, useState } from 'react'
import { getAdminCauses, createCause, updateCause, deleteCause } from '../../services/api'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const empty = { title: '', description: '', image_url: '', goal_amount: '', status: 'active' }

export default function AdminCauses() {
  const [causes, setCauses] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)

  const load = () => getAdminCauses().then(res => setCauses(res.data))
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(empty); setEditing(null); setModal(true) }
  const openEdit = (c) => { setForm({ title: c.title, description: c.description, image_url: c.image_url || '', goal_amount: c.goal_amount, status: c.status }); setEditing(c); setModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) { await updateCause(editing.id, form); toast.success('Cause updated') }
      else { await createCause(form); toast.success('Cause created') }
      setModal(false); load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving cause')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this cause?')) return
    await deleteCause(id); toast.success('Cause deleted'); load()
  }

  const f = (k) => ({ value: form[k], onChange: e => setForm({...form, [k]: e.target.value}) })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Causes</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Cause</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>{['Title', 'Goal', 'Raised', 'Status', ''].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {causes.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{c.title}</td>
                <td className="px-4 py-3 text-gray-600">${Number(c.goal_amount).toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">${Number(c.raised_amount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                    ${c.status === 'active' ? 'bg-green-100 text-green-700' : c.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-primary-600"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">{editing ? 'Edit Cause' : 'New Cause'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div><label className="label">Title</label><input className="input" {...f('title')} required /></div>
              <div><label className="label">Description</label><textarea className="input" rows={3} {...f('description')} required /></div>
              <div><label className="label">Image URL</label><input className="input" {...f('image_url')} /></div>
              <div><label className="label">Goal Amount ($)</label><input type="number" className="input" {...f('goal_amount')} min="1" required /></div>
              <div><label className="label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary flex-1">Save</button>
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
