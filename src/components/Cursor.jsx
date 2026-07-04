import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    let x = innerWidth / 2
    let y = innerHeight / 2
    let rx = x
    let ry = y
    let raf

    const move = (e) => {
      x = e.clientX
      y = e.clientY
      if (dot.current)
        dot.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
    }
    const over = (e) => {
      const hot = !!e.target.closest('a, button, [data-cursor]')
      ring.current?.classList.toggle('hot', hot)
    }
    const loop = () => {
      rx += (x - rx) * 0.14
      ry += (y - ry) * 0.14
      if (ring.current)
        ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    addEventListener('mousemove', move, { passive: true })
    addEventListener('mouseover', over, { passive: true })
    raf = requestAnimationFrame(loop)
    document.documentElement.classList.add('no-cursor')
    return () => {
      removeEventListener('mousemove', move)
      removeEventListener('mouseover', over)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('no-cursor')
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  )
}
