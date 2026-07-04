import { fmtDate } from '../api'

export default function Ticker({ events = [] }) {
  const items = events.length
    ? events.map((e) => `${e.shortName} · ${fmtDate(e.date)} · ${e.city || e.venue}`)
    : ['CAGESIDE', 'EVERYTHING OCTAGON', 'FIGHT WEEK IS EVERY WEEK']
  const loop = [...items, ...items, ...items, ...items]
  return (
    <div className="ticker">
      <div className="ticker-track">
        {loop.map((t, i) => (
          <span className="ticker-item" key={i}>
            {t.toUpperCase()} <span className="ticker-sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
