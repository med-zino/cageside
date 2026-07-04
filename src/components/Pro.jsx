import { Reveal, SectionHead, Tilt } from './ui'

const TIERS = [
  {
    name: 'FAN',
    price: 'FREE',
    tag: null,
    perks: ['Fight cards & countdowns', 'Live rankings', 'News feed', 'Weekly newsletter'],
    cta: 'YOU ARE HERE',
  },
  {
    name: 'INSIDER',
    price: '$4.99',
    per: '/mo',
    tag: null,
    perks: ['Everything in Fan', 'Zero ads', 'Pick’em leagues & prizes', 'Fight-week email breakdowns'],
    cta: 'COMING SOON',
  },
  {
    name: 'PRO',
    price: '$9.99',
    per: '/mo',
    tag: 'MOST POPULAR',
    perks: [
      'Everything in Insider',
      'AI fight predictions & odds edge',
      'Live judge scorecards',
      'Private Discord war room',
    ],
    cta: 'COMING SOON',
    featured: true,
  },
]

export default function Pro() {
  return (
    <section className="section pro" id="pro">
      <SectionHead label="GO PREMIUM" title="CAGESIDE PRO" />
      <div className="pro-grid">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1}>
            <Tilt className={`pro-card ${t.featured ? 'featured' : ''}`} max={4}>
              {t.tag && <span className="pro-tag">{t.tag}</span>}
              <div className="pro-name">{t.name}</div>
              <div className="pro-price">
                {t.price}
                {t.per && <span className="pro-per">{t.per}</span>}
              </div>
              <ul className="pro-perks">
                {t.perks.map((p) => (
                  <li key={p}>
                    <span className="perk-dot">✦</span> {p}
                  </li>
                ))}
              </ul>
              <button className={`btn ${t.featured ? 'btn-red' : 'btn-ghost'} pro-btn`}>
                {t.cta}
              </button>
            </Tilt>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="affiliate-row">
          <span className="aff-label">FIGHT WEEK ESSENTIALS</span>
          <a href="#" onClick={(e) => e.preventDefault()}>WATCH THE PPV ↗</a>
          <a href="#" onClick={(e) => e.preventDefault()}>OFFICIAL TICKETS ↗</a>
          <a href="#" onClick={(e) => e.preventDefault()}>FIGHT GEAR ↗</a>
          <span className="aff-note">Partner links — we may earn a commission. Demo pricing.</span>
        </div>
      </Reveal>
    </section>
  )
}
