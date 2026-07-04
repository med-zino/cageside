import { motion, useScroll, useTransform } from 'motion/react'
import { useCountdown } from '../hooks'
import { slugify, headshot } from '../api'

const EASE = [0.16, 1, 0.3, 1]
const pad = (n) => String(n).padStart(2, '0')

function Line({ children, delay, className = '' }) {
  return (
    <span className={`mask hero-line ${className}`}>
      <motion.span
        className="hero-line-inner"
        initial={{ y: '115%' }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 1, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

function Unit({ v, label }) {
  const s = pad(v)
  return (
    <div className="cd-unit" data-cursor>
      <div className="cd-num">
        <motion.span
          key={s}
          initial={{ y: '45%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {s}
        </motion.span>
      </div>
      <span className="cd-label">{label}</span>
    </div>
  )
}

export default function Hero({ event, fightersMap = {} }) {
  const cd = useCountdown(event?.date)
  const { scrollY } = useScroll()
  const yA = useTransform(scrollY, [0, 900], [0, 140])
  const yB = useTransform(scrollY, [0, 900], [0, 220])
  const fade = useTransform(scrollY, [0, 650], [1, 0.15])

  let nameA = 'FIGHT'
  let nameB = 'NIGHT'
  let imgA = null
  let imgB = null
  if (event?.main?.fighters?.length === 2) {
    const [fa, fb] = event.main.fighters
    nameA = (fa.name.split(' ').pop() || nameA).toUpperCase()
    nameB = (fb.name.split(' ').pop() || nameB).toUpperCase()
    imgA = fightersMap[slugify(fa.name)]?.imgUrl || headshot(fa.id)
    imgB = fightersMap[slugify(fb.name)]?.imgUrl || headshot(fb.id)
  }
  const brand = (event?.name || '').split(':')[0]
  const when = event
    ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : ''

  const goEvents = () =>
    window.__lenis
      ? window.__lenis.scrollTo('#events', { offset: -70, duration: 1.4 })
      : document.querySelector('#events')?.scrollIntoView({ behavior: 'smooth' })
  const goPro = () =>
    window.__lenis
      ? window.__lenis.scrollTo('#pro', { duration: 1.6 })
      : document.querySelector('#pro')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="hero" id="top">
      <div className="hero-glow" />
      <div className="hero-grid-lines" />

      {imgA && (
        <motion.img
          className="hero-fighter left"
          src={imgA}
          alt={nameA}
          style={{ y: yA }}
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.35, duration: 1.2, ease: EASE }}
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
      {imgB && (
        <motion.img
          className="hero-fighter right"
          src={imgB}
          alt={nameB}
          style={{ y: yB }}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.45, duration: 1.2, ease: EASE }}
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}

      <motion.div className="hero-inner" style={{ opacity: fade }}>
        {event && (
          <motion.div
            className="hero-kicker"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.15, duration: 0.7, ease: EASE }}
          >
            <span className="pulse" />
            NEXT EVENT · {when} · {event.venue} — {event.city}
          </motion.div>
        )}

        <h1 className="hero-title">
          <Line delay={2.2}>{nameA}</Line>
          <Line delay={2.32} className="vs">
            VS
          </Line>
          <Line delay={2.42}>{nameB}</Line>
        </h1>

        {event && (
          <motion.div
            className="hero-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.7, duration: 0.7 }}
          >
            {brand} — {event.matchup}
          </motion.div>
        )}

        <motion.div
          className="hero-countdown"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8, ease: EASE }}
        >
          <Unit v={cd.d} label="DAYS" />
          <span className="cd-sep">:</span>
          <Unit v={cd.h} label="HRS" />
          <span className="cd-sep">:</span>
          <Unit v={cd.m} label="MIN" />
          <span className="cd-sep">:</span>
          <Unit v={cd.s} label="SEC" />
        </motion.div>

        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.95, duration: 0.8, ease: EASE }}
        >
          <button className="btn btn-red" onClick={goEvents}>
            FULL FIGHT CARD →
          </button>
          <button className="btn btn-ghost" onClick={goPro}>
            GET PRO PICKS
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4 }}
      >
        <span className="hint-line" />
        SCROLL
      </motion.div>
    </section>
  )
}
