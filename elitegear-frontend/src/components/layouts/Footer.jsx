import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="signature" style={{ padding: '64px 0 32px' }}>
      <div className="max-w-eg px-eg mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-bold text-2xl tracking-tight mb-3"
              style={{ fontStyle: 'italic', color: 'var(--oat-milk)' }}>
              EliteGear
            </div>
            <p className="body-sm" style={{ color: 'rgba(241,237,227,0.65)', maxWidth: '200px', lineHeight: 1.7 }}>
              Premium sports engineering for athletes who refuse to settle. Architectural precision in every stitch.
            </p>
            <div className="flex gap-4 mt-6">
              {['𝕏', '📘', '📷'].map((icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-colors"
                  style={{ background: 'rgba(241,237,227,0.1)', color: 'var(--oat-milk)', border: 'none', cursor: 'pointer' }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="label mb-5" style={{ color: 'rgba(241,237,227,0.5)' }}>Company</p>
            <div className="flex flex-col gap-3">
              {['Contact Us', 'Shipping', 'Returns', 'About'].map(item => (
                <a key={item} href="#" className="body-sm transition-colors"
                  style={{ color: 'rgba(241,237,227,0.75)', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'var(--oat-milk)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(241,237,227,0.75)'}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="label mb-5" style={{ color: 'rgba(241,237,227,0.5)' }}>Legal</p>
            <div className="flex flex-col gap-3">
              {['Privacy Policy', 'Terms of Service', 'Artifact Care', 'Support'].map(item => (
                <a key={item} href="#" className="body-sm transition-colors"
                  style={{ color: 'rgba(241,237,227,0.75)', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'var(--oat-milk)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(241,237,227,0.75)'}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="label mb-5" style={{ color: 'rgba(241,237,227,0.5)' }}>Newsletter</p>
            <p className="body-sm mb-4" style={{ color: 'rgba(241,237,227,0.65)' }}>
              Join the elite. Get exclusive drops.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="JOIN THE ELITE"
                className="flex-1"
                style={{
                  background: 'rgba(241,237,227,0.1)',
                  border: '1px solid rgba(241,237,227,0.2)',
                  color: 'var(--oat-milk)',
                  fontSize: '12px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontFamily: "'Lexend', sans-serif",
                  outline: 'none'
                }}
              />
              <button className="btn-secondary px-4" style={{ padding: '10px 16px', fontSize: '16px' }}>→</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8"
          style={{ borderTop: '1px solid rgba(241,237,227,0.15)' }}>
          <p className="label" style={{ color: 'rgba(241,237,227,0.4)' }}>
            © ELITEGEAR
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {['Terms', 'Privacy', 'Support'].map(item => (
              <a key={item} href="#" className="label"
                style={{ color: 'rgba(241,237,227,0.4)', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = 'var(--oat-milk)'}
                onMouseLeave={e => e.target.style.color = 'rgba(241,237,227,0.4)'}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}