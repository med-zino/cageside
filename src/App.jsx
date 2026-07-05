import { useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import Lenis from 'lenis'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import Events from './components/Events'
import Rankings from './components/Rankings'
import Spotlight from './components/Spotlight'
import News from './components/News'
import Join from './components/Join'
import Pro from './components/Pro'
import Footer from './components/Footer'
import Pickem from './components/Pickem'
import { fetchEvents, fetchNews, fetchRankings, fetchFighters } from './api'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [route, setRoute] = useState(window.location.hash)
  const [events, setEvents] = useState([])
  const [news, setNews] = useState([])
  const [rankings, setRankings] = useState([])
  const [fighters, setFighters] = useState({})

  // buttery smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 })
    window.__lenis = lenis
    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  // one shot of live data — everything else animates off it
  useEffect(() => {
    fetchEvents().then(setEvents).catch(() => {})
    fetchNews().then(setNews).catch(() => {})
    fetchRankings()
      .then((r) => Array.isArray(r) && setRankings(r))
      .catch(() => {})
    fetchFighters()
      .then((f) => f && typeof f === 'object' && setFighters(f))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1900)
    return () => clearTimeout(t)
  }, [])

  // hash routing: #/pickem is its own page, everything else is home
  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash)
      if (window.location.hash.startsWith('#/')) {
        window.__lenis
          ? window.__lenis.scrollTo(0, { immediate: true })
          : window.scrollTo(0, 0)
      }
    }
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])

  const onPickem = route.startsWith('#/pickem')

  return (
    <>
      <AnimatePresence>{loading && <Preloader key="pre" />}</AnimatePresence>
      <Cursor />
      <div className="noise" />
      <Nav />
      {onPickem ? (
        <main>
          <Pickem events={events} />
        </main>
      ) : (
        <main>
          <Hero event={events[0]} fightersMap={fighters} />
          <Ticker events={events} />
          <Events events={events} />
          <Rankings rankings={rankings} fightersMap={fighters} />
          <Spotlight rankings={rankings} fightersMap={fighters} />
          <News news={news} />
          <Join />
          <Pro />
        </main>
      )}
      <Footer />
    </>
  )
}
