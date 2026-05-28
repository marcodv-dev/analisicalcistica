import { useState } from 'react'
import { useTags } from '../../hooks/useTags'
import type { TagCategory } from '../../types'
import { TAG_CATEGORIES } from '../../types'

export default function TagsManager() {
  const { tags, loading, addTag, editTag, removeTag } = useTags()
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState<TagCategory>('tactical')

  if (loading) return <div className="loading"><div className="spinner" /></div>

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const handleAdd = async () => {
    if (!newName.trim()) return
    const cat = TAG_CATEGORIES.find(c => c.value === newCategory)
    await addTag({
      name: capitalize(newName.trim()),
      category: newCategory,
      color: cat?.color,
    })
    setNewName('')
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 12 }}>
        <span className="card-title" style={{ display: 'block', marginBottom: 12 }}>➕ Nuovo Tag</span>
        <div style={{ display: 'flex', gap: 8, flexDirection:'column' }}>
          <div style={{display:'flex',gap:8}}>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Nome tag..."
              style={{ flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <select value={newCategory} onChange={e => setNewCategory(e.target.value as TagCategory)} style={{ width: 'auto' }}>
              {TAG_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <button className="btn-primary btn-sm" onClick={handleAdd}>Aggiungi</button>
        </div>
      </div>

      {TAG_CATEGORIES.map(cat => {
        const catTags = tags.filter(t => t.category === cat.value)
        if (catTags.length === 0) return null
        return (
          <div key={cat.value} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: cat.color, marginBottom: 8 }}>
              {cat.label}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {catTags.map(tag => (
                <div
                  key={tag.id}
                  className="tag"
                  style={{
                    background: `${tag.color}20`,
                    border: `1px solid ${tag.color}40`,
                    color: tag.color,
                  }}
                >
                  {tag.name}
                  <span style={{ fontSize: '0.7rem', opacity: 0.6, marginLeft: 4 }}>
                    ({tag.useCount})
                  </span>
                  <span
                    className="tag-remove"
                    onClick={() => {if (window.confirm(`Eliminare il tag "${tag.name}"?`)) removeTag(tag.id)}}
                    style={{ marginLeft: 4 }}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
