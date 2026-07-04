const ESPN = 'https://site.api.espn.com/apis/site/v2/sports/mma/ufc'
const OCTAGON = 'https://api.octagon-api.com'

const pad = (n) => String(n).padStart(2, '0')
const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`

// "Conor McGregor" -> "conor-mcgregor" (matches Octagon API fighter ids)
export const slugify = (name = '') =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’.]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const headshot = (id) =>
  `https://a.espncdn.com/i/headshots/mma/players/full/${id}.png`

export const fmtDate = (iso, opts = {}) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...opts,
  })

export async function fetchEvents() {
  const from = new Date()
  const to = new Date()
  to.setMonth(to.getMonth() + 6)
  const res = await fetch(`${ESPN}/scoreboard?dates=${ymd(from)}-${ymd(to)}`)
  const data = await res.json()
  return (data.events || [])
    .map((e) => {
      const comps = e.competitions || []
      const bouts = comps.map((c) => ({
        id: c.id,
        weight: c.type?.abbreviation || '',
        fighters: [...(c.competitors || [])]
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((t) => ({
            id: t.id,
            name: t.athlete?.displayName || '',
            short: t.athlete?.shortName || '',
          })),
      }))
      // main event = the bout whose two last names both appear in the event title
      const matchup = (e.name.split(':')[1] || '').trim()
      const lower = matchup.toLowerCase()
      const main =
        bouts.find(
          (b) =>
            b.fighters.length === 2 &&
            b.fighters.every((f) =>
              lower.includes((f.name.split(' ').pop() || '').toLowerCase())
            )
        ) || bouts[0]
      const venue = comps[0]?.venue
      return {
        id: e.id,
        name: e.name,
        shortName: e.shortName,
        date: e.date,
        matchup,
        venue: venue?.fullName || 'Venue TBA',
        city: [venue?.address?.city, venue?.address?.state || venue?.address?.country]
          .filter(Boolean)
          .join(', '),
        bouts,
        main,
      }
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

export async function fetchNews() {
  const res = await fetch(`${ESPN}/news?limit=10`)
  const data = await res.json()
  return (data.articles || [])
    .map((a) => ({
      id: a.id,
      headline: a.headline,
      description: a.description,
      published: a.published,
      image: a.images?.[0]?.url,
      link: a.links?.web?.href || '#',
    }))
    .filter((a) => a.image)
}

export async function fetchRankings() {
  const res = await fetch(`${OCTAGON}/rankings`)
  return res.json()
}

export async function fetchFighters() {
  const res = await fetch(`${OCTAGON}/fighters`)
  return res.json()
}
