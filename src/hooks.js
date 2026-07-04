import { useEffect, useState } from 'react'

export function useCountdown(target) {
  const calc = () => {
    if (!target) return { d: 0, h: 0, m: 0, s: 0, live: false }
    const diff = Math.max(0, new Date(target) - Date.now())
    return {
      d: Math.floor(diff / 864e5),
      h: Math.floor(diff / 36e5) % 24,
      m: Math.floor(diff / 6e4) % 60,
      s: Math.floor(diff / 1e3) % 60,
      live: diff <= 0,
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const i = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(i)
  }, [target])
  return t
}
