import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useInView, animate } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1]

export function Reveal({ children, delay = 0, y = 40, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHead({ label, title, right }) {
  const words = String(title).split(' ')
  return (
    <div className="section-head">
      <Reveal>
        <div className="section-label">
          <span className="dot" />
          {label}
        </div>
      </Reveal>
      <div className="section-head-row">
        <h2 className="section-title">
          {words.map((w, i) => (
            <span className="mask" key={i}>
              <motion.span
                className="word"
                initial={{ y: '115%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.9, delay: i * 0.09, ease: EASE }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h2>
        {right && <Reveal delay={0.3}>{right}</Reveal>}
      </div>
    </div>
  )
}

export function Tilt({ children, className, max = 7 }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 220, damping: 18 })
  const sry = useSpring(ry, { stiffness: 220, damping: 18 })
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }
  return (
    <motion.div
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  )
}

export function Counter({ to = 0, duration = 1.6 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, Number(to) || 0, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setV(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, to, duration])
  return <span ref={ref}>{v}</span>
}
