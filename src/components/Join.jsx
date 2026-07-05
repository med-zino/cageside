import { useState } from 'react'
import { Reveal, SectionHead } from './ui'
import { DISCORD_INVITE, FORM_ENDPOINT, WEB3FORMS_KEY, PICKEM_PRIZE } from '../config'

const PERKS = [
  ['📋', 'FIGHT WEEK BRIEF', 'Card breakdown + one stat nobody noticed, every Tuesday'],
  ['⏰', 'START-TIME ALERTS', 'One email before the main card — never miss a walkout'],
  ['🎯', "PICK'EM CONTEST", `Predict the card, top score wins a ${PICKEM_PRIZE.toLowerCase()}`],
  ['💬', 'FIGHT NIGHT DISCORD', 'Live watch-party channel — trash talk encouraged'],
]

export default function Join() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | sending | done | error

  const submit = async (e) => {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setState('error')
    setState('sending')
    try {
      if (FORM_ENDPOINT && WEB3FORMS_KEY) {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: 'New CAGESIDE fight-week subscriber',
            from_name: 'CAGESIDE',
            email,
            source: 'cageside-fight-week',
          }),
        })
        const data = await res.json()
        if (!data.success) throw new Error('form endpoint rejected')
      } else {
        const list = JSON.parse(localStorage.getItem('cageside-emails') || '[]')
        list.push({ email, at: new Date().toISOString() })
        localStorage.setItem('cageside-emails', JSON.stringify(list))
      }
      setState('done')
    } catch {
      setState('error')
    }
  }

  return (
    <section className="section join" id="join">
      <SectionHead label="FREE — NO SPAM, JUST FIGHTS" title="JOIN FIGHT WEEK" />
      <div className="join-body">
        <div className="join-perks">
          {PERKS.map(([icon, title, desc], i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="join-perk">
                <span className="join-perk-icon">{icon}</span>
                <div>
                  <div className="join-perk-title">{title}</div>
                  <div className="join-perk-desc">{desc}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="join-panel-wrap">
          <div className="join-panel">
            {state === 'done' ? (
              <div className="join-done">
                <div className="join-done-big">YOU'RE IN. 🥊</div>
                <p>One more step — the good stuff happens in the Discord:</p>
                <a
                  className="btn btn-red join-discord"
                  href={DISCORD_INVITE || '#join'}
                  target={DISCORD_INVITE ? '_blank' : undefined}
                  rel="noreferrer"
                >
                  JOIN THE DISCORD →
                </a>
              </div>
            ) : (
              <form className="join-form" onSubmit={submit}>
                <label className="join-label" htmlFor="join-email">
                  DROP YOUR EMAIL — GET THE UFC 329 BRIEF
                </label>
                <div className="join-row">
                  <input
                    id="join-email"
                    type="email"
                    placeholder="you@fightfan.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (state === 'error') setState('idle')
                    }}
                    data-cursor
                  />
                  <button className="btn btn-red" type="submit" disabled={state === 'sending'}>
                    {state === 'sending' ? '...' : 'JOIN →'}
                  </button>
                </div>
                {state === 'error' && (
                  <div className="join-error">THAT EMAIL DIDN'T LAND — TRY AGAIN</div>
                )}
                <div className="join-or">— OR SKIP STRAIGHT TO —</div>
                <a
                  className="btn btn-ghost join-discord"
                  href={DISCORD_INVITE || '#join'}
                  target={DISCORD_INVITE ? '_blank' : undefined}
                  rel="noreferrer"
                >
                  💬 THE FIGHT NIGHT DISCORD
                </a>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
