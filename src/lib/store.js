import { useCallback, useSyncExternalStore } from 'react'

const cache = new Map()
const subs = new Map()
const ls = () => { try { return typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage } catch { return undefined } }

function load(key, seed) {
  if (!cache.has(key)) {
    let v = null
    try { const raw = ls()?.getItem(key); if (raw) v = JSON.parse(raw) } catch {  }
    if (v == null) v = typeof seed === 'function' ? seed() : seed
    cache.set(key, v)
  }
  return cache.get(key)
}

export function save(key, value) {
  cache.set(key, value)
  try { ls()?.setItem(key, JSON.stringify(value)) } catch {  }
  subs.get(key)?.forEach((f) => f())
}

export function useStore(key, seed) {
  const subscribe = useCallback((cb) => {
    if (!subs.has(key)) subs.set(key, new Set())
    subs.get(key).add(cb)
    return () => subs.get(key).delete(cb)
  }, [key])
  const value = useSyncExternalStore(subscribe, () => load(key, seed), () => load(key, seed))
  const set = useCallback((next) => save(key, typeof next === 'function' ? next(load(key, seed)) : next), [key]) 
  return [value, set]
}

export const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export function useCollection(key, seed) {
  const [items, set] = useStore(key, seed)
  return {
    items,
    set,
    add: (item) => {
      const rec = { id: uid(), createdAt: new Date().toISOString(), ...item }
      set((l) => [...l, rec])
      return rec
    },
    update: (id, patch) => set((l) => l.map((x) => (x.id === id ? { ...x, ...(typeof patch === 'function' ? patch(x) : patch) } : x))),
    remove: (id) => set((l) => l.filter((x) => x.id !== id)),
    removeWhere: (fn) => set((l) => l.filter((x) => !fn(x))),
  }
}

export function resetMockData() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith('edupress.')).forEach((k) => localStorage.removeItem(k))
  } catch {  }
  window.location.href = '/'
}
