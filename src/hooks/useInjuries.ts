import { useState, useEffect, useCallback } from 'react'
import * as db from '../db'
import type { Injury } from '../types'

export function useInjuries() {
  const [injuries, setInjuries] = useState<Injury[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await db.getAllInjuries()
    setInjuries(data)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const addInjury = useCallback(async (injury: Omit<Injury, 'id'>) => {
    const id = await db.saveInjury(injury)
    await refresh()
    return id
  }, [refresh])

  const editInjury = useCallback(async (injury: Injury) => {
    await db.updateInjury(injury)
    await refresh()
  }, [refresh])

  const removeInjury = useCallback(async (id: string) => {
    await db.deleteInjury(id)
    await refresh()
  }, [refresh])

  return { injuries, loading, refresh, addInjury, editInjury, removeInjury }
}
