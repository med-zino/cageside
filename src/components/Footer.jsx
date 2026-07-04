export default function Footer() {
  const words = Array(8).fill('CAGESIDE ✦ EVERYTHING OCTAGON ✦ ')
  return (
    <footer className="footer">
      <div className="footer-marquee">
        <div className="footer-track">
          {words.map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 CAGESIDE</span>
        <span className="footer-disclaimer">
          Unofficial fan project — not affiliated with UFC® or Zuffa LLC. Data via public ESPN &
          Octagon APIs. Images © their respective owners.
        </span>
        <span>LAS VEGAS · EVERYWHERE</span>
      </div>
    </footer>
  )
}
