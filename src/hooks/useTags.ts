import { useState, useEffect, useCallback, useRef } from 'react'
import * as db from '../db'
import type { Tag } from '../types'
import { PRESET_TAGS } from '../types'

let seedingPromise: Promise<void> | null = null

async function ensurePresetsSeeded() {
  if (seedingPromise) return seedingPromise
  seedingPromise = (async () => {
    const data = await db.getAllTags()
    // Dedup: keep only one tag per name (the one with most uses)
    const seen = new Map<string, Tag>()
    for (const tag of data) {
      const existing = seen.get(tag.name)
      if (!existing || tag.useCount > existing.useCount) {
        seen.set(tag.name, tag)
      }
    }
    for (const tag of data) {
      if (seen.get(tag.name)?.id !== tag.id) {
        await db.deleteTag(tag.id)
      }
    }
    // Seed missing presets
    const existingNames = new Set(data.map(t => t.name))
    for (const preset of PRESET_TAGS) {
      if (!existingNames.has(preset.name)) {
        await db.saveTag(preset)
      }
    }
  })()
  return seedingPromise
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    await ensurePresetsSeeded()
    const updated = await db.getAllTags()
    setTags(updated)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const addTag = useCallback(async (tag: Omit<Tag, 'id' | 'useCount' | 'lastUsed' | 'createdAt'>) => {
    const id = await db.saveTag(tag)
    await refresh()
    return id
  }, [refresh])

  const editTag = useCallback(async (tag: Tag) => {
    await db.updateTag(tag)
    await refresh()
  }, [refresh])

  const removeTag = useCallback(async (id: string) => {
    await db.deleteTag(id)
    await refresh()
  }, [refresh])

  return { tags, loading, refresh, addTag, editTag, removeTag }
}

export function useTag(id: string | undefined) {
  const [tag, setTag] = useState<Tag | undefined>()
  useEffect(() => {
    if (id) db.getTag(id).then(setTag)
    else setTag(undefined)
  }, [id])
  return tag
}
