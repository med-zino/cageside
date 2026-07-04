import { Reveal, SectionHead } from './ui'

const ago = (iso) => {
  const h = Math.round((Date.now() - new Date(iso)) / 36e5)
  if (h < 1) return 'JUST IN'
  if (h < 24) return `${h}H AGO`
  const d = Math.round(h / 24)
  return d === 1 ? 'YESTERDAY' : `${d}D AGO`
}

export default function News({ news = [] }) {
  if (!news.length) return null
  const [lead, ...rest] = news
  return (
    <section className="section" id="news">
      <SectionHead label="LATEST INTEL" title="FIGHT NEWS" />
      <div className="news-grid">
        <Reveal className="news-lead-wrap">
          <a className="news-card news-lead" href={lead.link} target="_blank" rel="noreferrer">
            <div className="news-img">
              <img src={lead.image} alt="" loading="lazy" />
              <span className="news-time">{ago(lead.published)}</span>
            </div>
            <h3>{lead.headline}</h3>
            <p>{lead.description}</p>
            <span className="news-read">READ ON ESPN →</span>
          </a>
        </Reveal>
        {rest.slice(0, 6).map((a, i) => (
          <Reveal key={a.id} delay={(i % 3) * 0.07}>
            <a className="news-card" href={a.link} target="_blank" rel="noreferrer">
              <div className="news-img">
                <img src={a.image} alt="" loading="lazy" />
                <span className="news-time">{ago(a.published)}</span>
              </div>
              <h3>{a.headline}</h3>
              <span className="news-read">READ →</span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
