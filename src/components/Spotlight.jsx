import { motion } from 'motion/react'
import { Reveal, SectionHead, Counter } from './ui'

const inchesToFtIn = (v) => {
  const n = Math.round(parseFloat(v))
  if (!n) return '—'
  return `${Math.floor(n / 12)}'${n % 12}"`
}

function StatBar({ label, value, max, display }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="stat-row">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{display}</span>
      </div>
      <div className="stat-track">
        <motion.div
          className="stat-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

export default function Spotlight({ rankings = [], fightersMap = {} }) {
  // #1 pound-for-pound = the current king
  const p4p = rankings.find((r) => r.id.includes('pound-for-pound'))
  const kingRef = p4p?.fighters?.[0] || p4p?.champion
  const king = kingRef && fightersMap[kingRef.id]
  if (!king) return null

  const wins = parseInt(king.wins) || 0
  const losses = parseInt(king.losses) || 0

  return (
    <section className="section spotlight">
      <SectionHead label="POUND FOR POUND" title="KING OF THE HILL" />
      <div className="spot-body">
        <div className="spot-visual">
          <div className="spot-name-bg">{(king.name.split(' ').pop() || '').toUpperCase()}</div>
          <Reveal delay={0.15}>
            {king.imgUrl && (
              <img
                className="spot-img"
                src={king.imgUrl}
                alt={king.name}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
          </Reveal>
          <div className="spot-glow" />
        </div>

        <div className="spot-stats">
          <Reveal>
            <div className="spot-rank-chip">#1 POUND FOR POUND</div>
            <h3 className="spot-name">{king.name.toUpperCase()}</h3>
            {king.nickname && <div className="spot-nick">“{king.nickname}”</div>}
          </Reveal>

          <div className="spot-numbers">
            <div className="spot-num">
              <span className="spot-num-val">
                <Counter to={wins} />
              </span>
              <span className="spot-num-label">WINS</span>
            </div>
            <div className="spot-num">
              <span className="spot-num-val">
                <Counter to={losses} />
              </span>
              <span className="spot-num-label">LOSSES</span>
            </div>
            <div className="spot-num">
              <span className="spot-num-val">
                <Counter to={parseInt(king.age) || 0} />
              </span>
              <span className="spot-num-label">AGE</span>
            </div>
          </div>

          <div className="spot-bars">
            <StatBar
              label="HEIGHT"
              value={parseFloat(king.height) || 0}
              max={84}
              display={inchesToFtIn(king.height)}
            />
            <StatBar
              label="REACH"
              value={parseFloat(king.reach) || 0}
              max={84}
              display={`${Math.round(parseFloat(king.reach) || 0)}"`}
            />
            <StatBar
              label="LEG REACH"
              value={parseFloat(king.legReach) || 0}
              max={50}
              display={`${Math.round(parseFloat(king.legReach) || 0)}"`}
            />
          </div>

          <Reveal delay={0.2}>
            <div className="spot-meta">
              <span>{king.category?.toUpperCase()}</span>
              <span>{king.fightingStyle?.toUpperCase()}</span>
              <span>DEBUT {king.octagonDebut?.toUpperCase()}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
