import { Reveal, SectionHead, Tilt } from './ui'
import { headshot, fmtDate } from '../api'

function daysUntil(date) {
  const d = Math.ceil((new Date(date) - Date.now()) / 864e5)
  if (d <= 0) return 'TONIGHT'
  if (d === 1) return 'TOMORROW'
  return `IN ${d} DAYS`
}

export default function Events({ events = [] }) {
  const list = events.slice(0, 6)
  return (
    <section className="section" id="events">
      <SectionHead label="SCHEDULE" title="UPCOMING FIGHT CARDS" />
      <div className="events-grid">
        {list.map((e, i) => {
          const day = new Date(e.date)
          const [fa, fb] = e.main?.fighters || []
          return (
            <Reveal key={e.id} delay={(i % 3) * 0.08}>
              <Tilt className="event-card" max={5}>
                <div className="event-top">
                  <div className="event-date">
                    <span className="event-day">{day.getDate()}</span>
                    <span className="event-month">
                      {day.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </span>
                  </div>
                  <span className="event-chip">{daysUntil(e.date)}</span>
                </div>

                <div className="event-heads">
                  {fa && (
                    <img
                      src={headshot(fa.id)}
                      alt={fa.name}
                      loading="lazy"
                      onError={(ev) => (ev.currentTarget.style.visibility = 'hidden')}
                    />
                  )}
                  <span className="event-vs">VS</span>
                  {fb && (
                    <img
                      src={headshot(fb.id)}
                      alt={fb.name}
                      loading="lazy"
                      onError={(ev) => (ev.currentTarget.style.visibility = 'hidden')}
                    />
                  )}
                </div>

                <h3 className="event-name">{e.shortName}</h3>
                <p className="event-matchup">{e.matchup || e.name}</p>
                <div className="event-meta">
                  <span>{e.venue}</span>
                  <span>{e.city}</span>
                  <span>
                    {e.bouts.length} BOUTS · {fmtDate(e.date, { weekday: 'short' })}
                  </span>
                </div>
                <div className="event-line" />
              </Tilt>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
