import type { MaintenanceContact } from './config'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buttonRow(contact: MaintenanceContact): string {
  const parts: string[] = []

  if (contact.whatsappHref) {
    parts.push(
      `<a class="btn" href="${escapeHtml(contact.whatsappHref)}" rel="noopener noreferrer" target="_blank">Contact Us on WhatsApp</a>`,
    )
  }
  if (contact.mailtoHref) {
    parts.push(
      `<a class="btn" href="${escapeHtml(contact.mailtoHref)}">Send Email</a>`,
    )
  }
  if (contact.telHref) {
    parts.push(`<a class="btn btn-ghost" href="${escapeHtml(contact.telHref)}">Call Now</a>`)
  }

  if (parts.length === 0) {
    return ''
  }

  return `<div class="actions">${parts.join('')}</div>`
}

/**
 * Self-contained HTML (no external CSS/JS) for Edge middleware — works if the app shell fails.
 */
export function buildMaintenancePageHtml(contact: MaintenanceContact): string {
  const actions = buttonRow(contact)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>We&apos;ll Be Back Soon — Maintenance</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; }
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #f4f4f5;
      background: #050508;
      background-image:
        radial-gradient(ellipse 120% 80% at 50% -20%, rgba(99, 102, 241, 0.22), transparent 55%),
        radial-gradient(ellipse 80% 50% at 100% 50%, rgba(16, 185, 129, 0.08), transparent 45%),
        radial-gradient(ellipse 60% 40% at 0% 100%, rgba(59, 130, 246, 0.12), transparent 50%),
        linear-gradient(165deg, #0a0a0f 0%, #12121a 45%, #08080c 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(1.25rem, 4vw, 2.5rem);
      -webkit-font-smoothing: antialiased;
    }
    .glow-orb {
      position: fixed;
      width: min(42vw, 320px);
      height: min(42vw, 320px);
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
      filter: blur(40px);
      pointer-events: none;
      animation: pulse 5s ease-in-out infinite;
    }
    .glow-orb.a { top: 10%; left: 15%; animation-delay: 0s; }
    .glow-orb.b { bottom: 15%; right: 10%; animation-delay: 2.5s; }
    @keyframes pulse {
      0%, 100% { opacity: 0.45; transform: scale(1); }
      50% { opacity: 0.85; transform: scale(1.08); }
    }
    .wrap {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 36rem;
      text-align: center;
      animation: fadeIn 1s ease-out both;
    }
    .brand {
      margin-bottom: 1.75rem;
      display: flex;
      justify-content: center;
      animation: fadeIn 0.85s ease-out both;
    }
    .brand-logo {
      height: clamp(2.25rem, 8vw, 3rem);
      width: auto;
      max-width: min(220px, 85vw);
      object-fit: contain;
      filter: drop-shadow(0 4px 24px rgba(0, 0, 0, 0.45));
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .badge {
      display: inline-block;
      font-size: 0.7rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(244, 244, 245, 0.55);
      margin-bottom: 1.25rem;
    }
    h1 {
      font-size: clamp(1.75rem, 5vw, 2.35rem);
      font-weight: 600;
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin-bottom: 1rem;
      text-shadow: 0 0 40px rgba(255,255,255,0.08);
    }
    p.sub {
      font-size: clamp(0.95rem, 2.5vw, 1.05rem);
      line-height: 1.65;
      color: rgba(244, 244, 245, 0.72);
      margin-bottom: 2rem;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
      align-items: center;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 2.75rem;
      padding: 0 1.35rem;
      font-size: 0.9rem;
      font-weight: 500;
      color: #fafafa;
      text-decoration: none;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(255, 255, 255, 0.04);
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.04) inset,
        0 4px 24px rgba(0, 0, 0, 0.35);
      transition: transform 0.2s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease;
    }
    .btn:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.35);
      background: rgba(255, 255, 255, 0.1);
      box-shadow:
        0 0 24px rgba(99, 102, 241, 0.35),
        0 0 48px rgba(16, 185, 129, 0.12),
        0 8px 32px rgba(0, 0, 0, 0.45);
    }
    .btn:active { transform: translateY(0); }
    .btn-ghost {
      background: transparent;
      border-color: rgba(255, 255, 255, 0.1);
    }
    .divider {
      height: 1px;
      width: 4rem;
      margin: 2rem auto 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    }
  </style>
</head>
<body>
  <div class="glow-orb a" aria-hidden="true"></div>
  <div class="glow-orb b" aria-hidden="true"></div>
  <main class="wrap">
    <div class="brand">
      <img
        class="brand-logo"
        src="/logo-white.svg"
        alt="Shamal Technologies"
        width="220"
        height="64"
        decoding="async"
      />
    </div>
    <span class="badge">Maintenance</span>
    <h1>We&apos;ll Be Back Soon</h1>
    <p class="sub">Our website is currently undergoing maintenance. We&apos;ll be back shortly.</p>
    ${actions}
    <div class="divider" aria-hidden="true"></div>
  </main>
</body>
</html>`
}
