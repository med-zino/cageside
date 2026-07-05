import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { DISCORD_INVITE } from '../config'

const LINKS = [
  ['EVENTS', '#events'],
  ['RANKINGS', '#rankings'],
  ['NEWS', '#news'],
  ['JOIN', '#join'],
]

export default function Nav() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40)
    addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])

  const go = (e, hash) => {
    e.preventDefault()
    // section links only exist on the home page — leave #/pickem first
    if (window.location.hash.startsWith('#/')) {
      window.location.hash = ''
      setTimeout(() => {
        if (window.__lenis) window.__lenis.scrollTo(hash, { offset: -70, duration: 1.2 })
        else document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      }, 60)
      return
    }
    if (window.__lenis) window.__lenis.scrollTo(hash, { offset: -70, duration: 1.4 })
    else document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      className={`nav ${solid ? 'solid' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ delay: 2.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <a className="nav-logo" href="#top" onClick={(e) => go(e, '#top')}>
        CAGESIDE<span className="logo-block">▮</span>
      </a>
      <nav className="nav-links">
        {LINKS.map(([label, hash]) => (
          <a key={hash} href={hash} onClick={(e) => go(e, hash)}>
            {label}
          </a>
        ))}
        <a className="nav-pickem" href="#/pickem">
          PICK'EM
        </a>
      </nav>
      <a
        className="nav-discord"
        href={DISCORD_INVITE || '#join'}
        onClick={DISCORD_INVITE ? undefined : (e) => go(e, '#join')}
        target={DISCORD_INVITE ? '_blank' : undefined}
        rel="noreferrer"
      >
        <span className="pulse" />
        DISCORD
      </a>
      <motion.div className="scroll-progress" style={{ scaleX }} />
    </motion.header>
  )
}
