import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Reveal } from './ui'
import { headshot } from '../api'
import { useCountdown } from '../hooks'
import { DISCORD_INVITE, PICKEM_PRIZE } from '../config'

const pad = (n) => String(n).padStart(2, '0')

function FighterBtn({ fighter, picked, onPick }) {
  return (
    <button
      className={`pk-fighter ${picked ? 'picked' : ''}`}
      onClick={onPick}
      data-cursor
    >
      <img
        src={headshot(fighter.id)}
        alt=""
        loading="lazy"
        onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
      />
      <span className="pk-fighter-name">{fighter.name}</span>
      <span className="pk-check">{picked ? '✔ PICKED' : 'PICK'}</span>
    </button>
  )
}

export default function Pickem({ events = [] }) {
  const event = events[0]
  const cd = useCountdown(event?.date)
  const storageKey = event ? `cageside-picks-${event.id}` : null
  const [picks, setPicks] = useState({})
  const [copied, setCopied] = useState(false)

  // main event first, then the rest of the card in listed order
  const bouts = useMemo(() => {
    if (!event) return []
    const rest = event.bouts.filter((b) => b.id !== event.main?.id)
    return [event.main, ...rest].filter((b) => b?.fighters?.length === 2)
  }, [event])

  useEffect(() => {
    if (!storageKey) return
    try {
      setPicks(JSON.parse(localStorage.getItem(storageKey)) || {})
    } catch {
      setPicks({})
    }
  }, [storageKey])

  const pick = (boutId, fighterId) => {
    const next = { ...picks, [boutId]: picks[boutId] === fighterId ? undefined : fighterId }
    setPicks(next)
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next))
    setCopied(false)
  }

  const pickedCount = bouts.filter((b) => picks[b.id]).length

  const submit = async () => {
    const lines = bouts
      .filter((b) => picks[b.id])
      .map((b) => {
        const w = b.fighters.find((f) => f.id === picks[b.id])
        const l = b.fighters.find((f) => f.id !== picks[b.id])
        return `${w.name} over ${l.name}`
      })
    const text = `🥊 CAGESIDE PICK'EM — ${event.shortName}\n${lines.join('\n')}\n(${pickedCount}/${bouts.length} picks)`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(true)
    }
    if (DISCORD_INVITE) window.open(DISCORD_INVITE, '_blank', 'noopener')
  }

  if (!event) {
    return (
      <div className="pk-page">
        <div className="pk-loading">LOADING THE CARD…</div>
      </div>
    )
  }

  return (
    <div className="pk-page">
      <header className="pk-head">
        <Reveal>
          <div className="pk-kicker">
            <span className="pulse" /> PICK'EM · {event.shortName} · WIN A {PICKEM_PRIZE}
          </div>
        </Reveal>
        <h1 className="pk-title">
          CALL EVERY <span className="pk-red">FIGHT.</span>
        </h1>
        <Reveal delay={0.1}>
          <div className="pk-sub">
            {event.matchup || event.name} — {event.venue}, {event.city}
          </div>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="pk-lock">
            PICKS LOCK IN{' '}
            <span className="pk-lock-time">
              {cd.d}D {pad(cd.h)}H {pad(cd.m)}M {pad(cd.s)}S
            </span>
          </div>
        </Reveal>
      </header>

      <div className="pk-bouts">
        {bouts.map((b, i) => (
          <Reveal key={b.id} delay={Math.min(i * 0.05, 0.3)}>
            <div className={`pk-bout ${i === 0 ? 'main-event' : ''}`}>
              <div className="pk-bout-label">
                {i === 0 ? '★ MAIN EVENT' : `BOUT ${i + 1}`} · {b.weight?.toUpperCase()}
              </div>
              <div className="pk-bout-row">
                <FighterBtn
                  fighter={b.fighters[0]}
                  picked={picks[b.id] === b.fighters[0].id}
                  onPick={() => pick(b.id, b.fighters[0].id)}
                />
                <span className="pk-vs">VS</span>
                <FighterBtn
                  fighter={b.fighters[1]}
                  picked={picks[b.id] === b.fighters[1].id}
                  onPick={() => pick(b.id, b.fighters[1].id)}
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <motion.div
        className="pk-bar"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="pk-bar-progress">
          <span className="pk-bar-count">
            {pickedCount}/{bouts.length}
          </span>
          PICKS MADE
          <div className="pk-bar-track">
            <div
              className="pk-bar-fill"
              style={{ width: `${(pickedCount / Math.max(1, bouts.length)) * 100}%` }}
            />
          </div>
        </div>
        {copied ? (
          <div className="pk-copied">
            ✔ PICKS COPIED — PASTE THEM IN <strong>#PICKEM</strong> ON THE DISCORD
            {!DISCORD_INVITE && ' (invite link coming soon)'}
          </div>
        ) : (
          <button className="btn btn-red" onClick={submit} disabled={pickedCount === 0}>
            SUBMIT PICKS → DISCORD
          </button>
        )}
      </motion.div>
    </div>
  )
}
