import { useState, useEffect } from 'react'
import * as db from '../db'
import type { AppSettings } from '../types'
import { DEFAULT_SETTINGS } from '../types'

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    db.getSettings().then(s => {
      setSettings(s)
      setLoading(false)
    })
  }, [])

  const update = async (partial: Partial<AppSettings>) => {
    const next = { ...settings, ...partial }
    setSettings(next)
    await db.saveSettings(next)
    applyTheme(next.darkMode)
  }

  return { settings, loading, update }
}

export function useTheme() {
  const { settings, update } = useSettings()

  useEffect(() => {
    applyTheme(settings.darkMode)
  }, [settings.darkMode])

  const toggle = () => update({ darkMode: !settings.darkMode })

  return { darkMode: settings.darkMode, toggle }
}

function applyTheme(dark: boolean) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
}
