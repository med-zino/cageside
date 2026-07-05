import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Reveal } from './ui'
import { headshot } from '../api'
import { useCountdown } from '../hooks'
import { DISCORD_INVITE, FORM_ENDPOINT, WEB3FORMS_KEY, PICKEM_PRIZE } from '../config'

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
  // idle → form (name/email modal) → sending → done
  const [phase, setPhase] = useState('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [formError, setFormError] = useState('')

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
      const entry = JSON.parse(localStorage.getItem(`cageside-entry-${event.id}`))
      if (entry) {
        setName(entry.name || '')
        setEmail(entry.email || '')
      }
    } catch {
      setPicks({})
    }
  }, [storageKey])

  const pick = (boutId, fighterId) => {
    const next = { ...picks, [boutId]: picks[boutId] === fighterId ? undefined : fighterId }
    setPicks(next)
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next))
    if (phase === 'done') setPhase('idle')
  }

  const pickedCount = bouts.filter((b) => picks[b.id]).length

  const picksText = () => {
    const lines = bouts
      .filter((b) => picks[b.id])
      .map((b) => {
        const w = b.fighters.find((f) => f.id === picks[b.id])
        const l = b.fighters.find((f) => f.id !== picks[b.id])
        return `${w.name} over ${l.name}`
      })
    return `🥊 CAGESIDE PICK'EM — ${event.shortName} — ${name.trim()}\n${lines.join('\n')}\n(${pickedCount}/${bouts.length} picks)`
  }

  const submitEntry = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setFormError('DROP A NICKNAME FOR THE LEADERBOARD')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setFormError("THAT EMAIL DIDN'T LAND")
    setFormError('')
    setPhase('sending')
    const text = picksText()
    try {
      if (FORM_ENDPOINT && WEB3FORMS_KEY) {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `Pick'em entry — ${name.trim()} (${pickedCount}/${bouts.length}) — ${event.shortName}`,
            from_name: 'CAGESIDE PICKEM',
            name: name.trim(),
            email,
            picks: text,
          }),
        })
        const data = await res.json()
        if (!data.success) throw new Error('entry rejected')
      }
      localStorage.setItem(`cageside-entry-${event.id}`, JSON.stringify({ name: name.trim(), email, at: new Date().toISOString() }))
      try {
        await navigator.clipboard.writeText(text)
      } catch {}
      setPhase('done')
    } catch {
      setPhase('form')
      setFormError('SOMETHING BROKE — TRY AGAIN')
    }
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
        {phase === 'done' ? (
          <div className="pk-copied">✔ ENTRY LOCKED IN, {name.trim().toUpperCase()}</div>
        ) : (
          <button
            className="btn btn-red"
            onClick={() => setPhase('form')}
            disabled={pickedCount === 0}
          >
            SUBMIT MY PICKS →
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {(phase === 'form' || phase === 'sending') && (
          <motion.div
            className="pk-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => phase === 'form' && setPhase('idle')}
          >
            <motion.form
              className="pk-modal"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={submitEntry}
            >
              <div className="pk-modal-title">LOCK IN YOUR ENTRY</div>
              <div className="pk-modal-sub">
                {pickedCount}/{bouts.length} PICKS · {event.shortName} · PRIZE: {PICKEM_PRIZE}
              </div>
              <label className="pk-modal-label" htmlFor="pk-name">
                NICKNAME (SHOWN ON THE LEADERBOARD)
              </label>
              <input
                id="pk-name"
                type="text"
                maxLength={30}
                placeholder="IronMike99"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-cursor
              />
              <label className="pk-modal-label" htmlFor="pk-email">
                EMAIL (RESULTS + PRIZE CONTACT — NO SPAM)
              </label>
              <input
                id="pk-email"
                type="email"
                placeholder="you@fightfan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-cursor
              />
              {formError && <div className="pk-modal-error">{formError}</div>}
              <button className="btn btn-red pk-modal-btn" type="submit" disabled={phase === 'sending'}>
                {phase === 'sending' ? 'LOCKING IN…' : 'LOCK IN MY PICKS 🔒'}
              </button>
              <button
                type="button"
                className="pk-modal-cancel"
                onClick={() => setPhase('idle')}
                disabled={phase === 'sending'}
              >
                KEEP EDITING
              </button>
            </motion.form>
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div
            className="pk-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPhase('idle')}
          >
            <motion.div
              className="pk-modal pk-modal-done"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pk-done-big">🥊 ENTRY LOCKED IN!</div>
              <p className="pk-done-text">
                You're on the card, <strong>{name.trim()}</strong>. Results land in your inbox
                after the fights. Your picks were also copied — paste them in{' '}
                <strong>#pickem</strong> and defend them:
              </p>
              <a
                className="btn btn-red pk-modal-btn"
                href={DISCORD_INVITE || '#'}
                target={DISCORD_INVITE ? '_blank' : undefined}
                rel="noreferrer"
              >
                JOIN THE TRASH TALK → DISCORD
              </a>
              <button type="button" className="pk-modal-cancel" onClick={() => setPhase('idle')}>
                BACK TO THE CARD
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
