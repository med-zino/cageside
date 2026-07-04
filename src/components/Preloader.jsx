import { motion } from 'motion/react'

export default function Preloader() {
  const letters = 'CAGESIDE'.split('')
  return (
    <motion.div
      className="preloader"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="preloader-word">
        {letters.map((l, i) => (
          <span className="mask" key={i}>
            <motion.span
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.15 + i * 0.055, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {l}
            </motion.span>
          </span>
        ))}
      </div>
      <motion.div
        className="preloader-tag"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.4 }}
      >
        EVERYTHING OCTAGON
      </motion.div>
      <motion.div
        className="preloader-bar"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 1.3, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
