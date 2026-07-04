import { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react'
import { SectionHead } from './ui'

export default function Rankings({ rankings = [], fightersMap = {} }) {
  const [cat, setCat] = useState(0)
  const [hover, setHover] = useState(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 260, damping: 26 })
  const sy = useSpring(my, { stiffness: 260, damping: 26 })

  if (!rankings.length) return null
  const active = rankings[cat] || rankings[0]
  const champ = active.champion
  const champImg = fightersMap[champ?.id]?.imgUrl
  const champData = fightersMap[champ?.id]

  const onMove = (e) => {
    mx.set(e.clientX)
    my.set(e.clientY)
  }

  return (
    <section className="section" id="rankings" onMouseMove={onMove}>
      <SectionHead label="THE HIERARCHY" title="OFFICIAL RANKINGS" />

      <div className="rank-tabs">
        {rankings.map((r, i) => (
          <button
            key={r.id}
            className={`rank-tab ${i === cat ? 'active' : ''}`}
            onClick={() => setCat(i)}
          >
            {r.categoryName.replace("Men's Pound-for-Pound Top Rank", 'P4P MEN')
              .replace("Women's Pound-for-Pound Top Rank", 'P4P WOMEN')
              .toUpperCase()}
          </button>
        ))}
      </div>

      <div className="rank-body">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id + '-champ'}
            className="rank-champ"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rank-champ-tag">— CHAMPION</div>
            <div className="rank-champ-img">
              {champImg ? (
                <img
                  src={champImg}
                  alt={champ.championName}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              ) : (
                <div className="rank-champ-noimg">👑</div>
              )}
            </div>
            <div className="rank-champ-name">{champ?.championName}</div>
            {champData && (
              <div className="rank-champ-record">
                {champData.wins}-{champData.losses}-{champData.draws}
                {champData.nickname ? ` · “${champData.nickname}”` : ''}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.ol
            key={active.id}
            className="rank-list"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            variants={{ show: { transition: { staggerChildren: 0.035 } } }}
            onMouseLeave={() => setHover(null)}
          >
            {active.fighters.slice(0, 15).map((f, i) => (
              <motion.li
                key={f.id}
                variants={{
                  hidden: { opacity: 0, x: 40 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                }}
                onMouseEnter={() => setHover({ id: f.id, img: fightersMap[f.id]?.imgUrl })}
                data-cursor
              >
                <span className="rank-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="rank-name">{f.name}</span>
                <span className="rank-arrow">→</span>
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>

      <motion.div className="rank-hover-img" style={{ x: sx, y: sy }}>
        <AnimatePresence>
          {hover?.img && (
            <motion.img
              key={hover.id}
              src={hover.img}
              alt=""
              initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
